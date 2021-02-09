import { IConfigFile } from "./IConfigFile";
import { IConfigRule } from "./IConfigRule";

export type IConfig = {
  files: IConfigFile | IConfigFile[];
  rules: IConfigRule | IConfigRule[];
};
