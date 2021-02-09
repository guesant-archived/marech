import { IRulesPresetOptions } from "./IRulesPresetOptions";

export type IGenerateConfigOptions = {
  files: [string, [string, string]];
  rules?: IRulesPresetOptions;
};
