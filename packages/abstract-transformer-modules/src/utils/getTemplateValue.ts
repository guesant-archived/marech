import { IModuleTemplate } from "../types/IModuleTemplate";

export const getTemplateValue = (
  template: IModuleTemplate[],
  name: string | undefined,
  defaultValue: string = "",
) => (template.find((i) => i.name === name) || {}).value || defaultValue;
