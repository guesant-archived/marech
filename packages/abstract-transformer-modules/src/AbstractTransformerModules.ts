import { AbstractTransformer } from "marech-core/build/AbstractTransformer";
import { IModuleSlot } from "./types/IModuleSlot";
import { IModuleTemplate } from "./types/IModuleTemplate";
import { getTemplateValue } from "./utils/getTemplateValue";

export abstract class AbstractTransformerModules<
  TransformerOptions extends object = {}
> extends AbstractTransformer<TransformerOptions> {
  abstract extractSlots(body: string): IModuleSlot[];
  abstract extractTemplates(body: string): IModuleTemplate[];
  abstract importModule(path: string, name: string): Promise<string>;
  getTemplateValue = getTemplateValue;
}
