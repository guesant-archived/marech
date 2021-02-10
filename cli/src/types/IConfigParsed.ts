import { IConfigFile } from "./IConfigFile";
import { IConfigRule } from "./IConfigRule";

export type IConfigParsed = {
  files: IConfigFile[];
  rules: IConfigRule[];
};
