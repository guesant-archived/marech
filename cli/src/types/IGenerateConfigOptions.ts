import { IConfigRule } from "./IConfigRule";
import { IMakeFileConfigObjectOptions } from "./IMakeFileConfigObjectOptions";
import { IRulesPresetOptions } from "./IRulesPresetOptions";

export type IGenerateConfigOptions = IMakeFileConfigObjectOptions & {
  rules?: IRulesPresetOptions | IConfigRule[];
};
