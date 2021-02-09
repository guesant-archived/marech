import {
  AbstractTransformerModules,
  IModuleSlot,
  IModuleTemplate,
} from "@guesant/marech-abstract-transformer-modules";
import { selectAll, selectOne } from "css-select";
import serialize from "dom-serializer";
import { Document, Node } from "domhandler";
import * as domutils from "domutils";
import { parseDocument } from "htmlparser2";
import * as HTMLUtils from "./HTMLUtils";
import { getDOM } from "./HTMLUtils/getDOM";

export class TransformerHTMLModule extends AbstractTransformerModules {
  SLOT_DEFAULT_NAME = "default";
  IMPORT_DEFAULT_NAME = "default";
  EXPORT_DEFAULT_NAME = "default";
  TEMPLATE_DEFAULT_NAME = "default";

  TAG_SLOT = "marech-slot";
  TAG_IMPORT = "marech-import";
  TAG_EXPORT = "marech-export";
  TAG_TEMPLATE = "marech-template";

  getDOM() {
    return getDOM(this.originalFileContent.toString("utf8"));
  }

  async importModule(path: string, name: string = this.IMPORT_DEFAULT_NAME) {
    const importedHTML = (await this.fs.read(path))!;
    const matchedElement = HTMLUtils.makeNamedSelection<Document>(
      getDOM(importedHTML),
      {
        baseSelector: this.TAG_EXPORT,
        attributeName: "name",
        attributeValue: name,
        attributeDefaultValue: this.EXPORT_DEFAULT_NAME,
      },
    )[0];
    return matchedElement
      ? serialize(matchedElement.children)
      : selectOne(this.TAG_EXPORT, getDOM(importedHTML)) === null
      ? importedHTML
      : "";
  }

  extractSlots(body: string) {
    return selectAll(this.TAG_SLOT, getDOM(body)).map((slotElement) => ({
      slotElement,
      name: HTMLUtils.getAttribute(slotElement, "name", this.SLOT_DEFAULT_NAME),
      defaultValue: serialize(domutils.getChildren(slotElement) || []),
    }));
  }

  extractTemplates(body: string) {
    return selectAll(this.TAG_TEMPLATE, getDOM(body)).map((el) => ({
      name: HTMLUtils.getAttribute(el, "name") || this.TEMPLATE_DEFAULT_NAME,
      value: domutils.hasAttrib(el as any, "value")
        ? HTMLUtils.getAttribute(el, "value")
        : serialize(domutils.getChildren(el) || []),
    }));
  }

  async loadModule(importElement: Node) {
    const src = HTMLUtils.getAttribute(importElement, "src", "")!;
    const name = HTMLUtils.getAttribute(
      importElement,
      "name",
      this.IMPORT_DEFAULT_NAME,
    )!;
    return getDOM(await this.importModule(src, name));
  }

  getImportElements(dom: Document) {
    return selectAll(this.TAG_IMPORT, domutils.getChildren(dom));
  }

  getSlotElements(dom: Document, name: string = this.SLOT_DEFAULT_NAME) {
    return HTMLUtils.makeNamedSelection(dom, {
      baseSelector: this.TAG_SLOT,
      attributeName: "name",
      attributeValue: name,
      attributeDefaultValue: this.SLOT_DEFAULT_NAME,
    });
  }

  mixTemplatesWithSlots(
    slots: (IModuleSlot & { slotElement: Node })[],
    template: IModuleTemplate[],
  ) {
    return slots.map(({ name, slotElement, defaultValue }) => ({
      name,
      slotElement,
      value: this.getTemplateValue(template, name, defaultValue),
    }));
  }

  async transform() {
    const dom = this.getDOM();
    await Promise.all(
      this.getImportElements(dom).map(async (importElement) => {
        const importedElement = await this.loadModule(importElement);
        this.mixTemplatesWithSlots(
          this.extractSlots(serialize(importedElement)),
          this.extractTemplates(serialize(importElement)),
        ).forEach(({ slotElement, value }) => {
          domutils.replaceElement(slotElement, parseDocument(value));
        });
        domutils.replaceElement(importElement, importedElement);
      }),
    );
    return Buffer.from(serialize(dom));
  }
}
