import {
  AbstractTransformerModules,
  IModuleSlot,
  IModuleTemplate,
} from "@guesant/marech-abstract-transformer-modules";
import { selectAll, selectOne } from "css-select";
import serialize from "dom-serializer";
import { Document, Element, Node } from "domhandler";
import * as domutils from "domutils";
import { removeElement, replaceElement } from "domutils";
import { parseDocument } from "htmlparser2";
import nunjunks from "nunjucks";
import * as HTMLUtils from "./HTMLUtils";
import { getDOM } from "./HTMLUtils/getDOM";

const removeImportElements = (dom: Document, selector: string) => {
  while (true) {
    const importElement = selectOne(selector, dom);
    if (!importElement) break;
    replaceElement(importElement, getDOM(serialize(importElement.children)));
  }
  return dom;
};

const parseJSON = (body: string) => {
  try {
    return JSON.parse(body);
  } catch (_) {
    return body;
  }
};
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

  extractSlotsFromDOM(dom: Document) {
    return selectAll(this.TAG_SLOT, dom).map((slotElement) => ({
      slotElement,
      name: HTMLUtils.getAttribute(slotElement, "name", this.SLOT_DEFAULT_NAME),
      defaultValue: serialize(domutils.getChildren(slotElement) || []),
    }));
  }

  extractTemplatesByDOM(dom: Document): { name: string; value: string }[] {
    const getTemplates = (dom: Document) => {
      return [
        ...Object.entries(
          ((selectOne(this.TAG_IMPORT, domCopy) as unknown) as Element | null)
            ?.attribs || {},
        )
          .filter(([k]) => k !== "src")
          .map(([name, value]) =>
            name.startsWith("m-")
              ? [
                  name.replace("m-", ""),
                  value.trim() === "" ? true : parseJSON(value),
                ]
              : [name, value],
          )
          .map(([name, value]) => ({ name, value })),
        ...selectAll(this.TAG_TEMPLATE, dom).map((el) => ({
          name: HTMLUtils.getAttribute(el, "name", this.TEMPLATE_DEFAULT_NAME)!,
          value: HTMLUtils.getAttribute(
            el,
            "value",
            serialize(domutils.getChildren(el) || []),
          )!,
        })),
      ];
    };

    const domCopy = getDOM(serialize(dom));

    selectAll(this.TAG_TEMPLATE, domCopy)
      .map((el) => ({
        templateElement: el,
        name: HTMLUtils.getAttribute(el, "name", this.TEMPLATE_DEFAULT_NAME)!,
      }))
      .filter((i) => i.name !== "default")
      .forEach((i) => removeElement(i.templateElement));

    return [
      ...getTemplates(dom),
      ...(selectAll(this.TAG_TEMPLATE, domCopy).length === 0
        ? [
            {
              name: this.TEMPLATE_DEFAULT_NAME,
              value: serialize(removeImportElements(domCopy, this.TAG_IMPORT)),
            },
          ]
        : []),
    ];
  }

  extractSlots(body: string) {
    return this.extractSlotsFromDOM(getDOM(body));
  }

  extractTemplates(body: string) {
    return this.extractTemplatesByDOM(getDOM(body));
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

  async renderNunjunks(body: string, template: any) {
    nunjunks.configure({ autoescape: false });
    return nunjunks.renderString(body, template);
  }

  async transform() {
    const dom = this.getDOM();
    await Promise.all(
      this.getImportElements(dom).map(async (importElement) => {
        nunjunks.configure;
        const template = this.extractTemplates(serialize(importElement));
        const importedElement = await (async () => {
          const _importedElement = await this.loadModule(importElement);
          return getDOM(
            await this.renderNunjunks(
              serialize(_importedElement),
              template.reduce(
                (acc, { name, value }) => ({ ...acc, [name]: value }),
                {},
              ),
            ),
          );
        })();
        this.mixTemplatesWithSlots(
          this.extractSlotsFromDOM(importedElement),
          template,
        ).forEach(({ slotElement, value }) => {
          domutils.replaceElement(slotElement, parseDocument(value));
        });
        domutils.replaceElement(importElement, importedElement);
      }),
    );
    return Buffer.from(serialize(dom));
  }
}
