import { IConfigRule } from "../types";
import { IConfig } from "../types/IConfig";
import { IGenerateConfigOptions } from "../types/IGenerateConfigOptions";
import { generateRules } from "./generateRules";
import { MakeFileConfig } from "./makeFileConfig";

export const generateConfig = (
  currentPath: string,
  { output, input, rules = {} }: IGenerateConfigOptions,
  customRulesAfter: IConfigRule[] = [],
  customRulesBefore: IConfigRule[] = [],
): IConfig => {
  return {
    files: MakeFileConfig.makeFileConfig(currentPath, { input, output })!,
    rules: [...customRulesBefore, ...generateRules(rules), ...customRulesAfter],
  };
};
