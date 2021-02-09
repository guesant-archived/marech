import { IConfigRule } from "../types";
import { IConfig } from "../types/IConfig";
import { IGenerateConfigOptions } from "../types/IGenerateConfigOptions";
import { generateRules } from "./generateRules";
import { MakeFileConfig } from "./makeFileConfig";

export const generateConfig = (
  {
    files: [outputPath, [inputPath, inputOptions]],
    rules = {},
  }: IGenerateConfigOptions,
  customRulesAfter: IConfigRule[] = [],
  customRulesBefore: IConfigRule[] = [],
): IConfig => {
  return {
    files: MakeFileConfig.makeFileConfig(outputPath, [inputPath, inputOptions]),
    rules: [...customRulesBefore, ...generateRules(rules), ...customRulesAfter],
  };
};
