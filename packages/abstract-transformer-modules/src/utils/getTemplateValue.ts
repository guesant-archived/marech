import { IModuleTemplate } from "../types/IModuleTemplate";

export const getTemplateValue = (
  template: IModuleTemplate[],
  name: string | undefined,
  defaultValue: string
) =>
  (template.find((definition) => definition.name === name) || {}).value ||
  defaultValue ||
  "";
