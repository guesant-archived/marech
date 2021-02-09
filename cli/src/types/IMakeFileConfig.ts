import { IConfigFile } from "./IConfigFile";
import { IMakeFileConfigObjectOptions } from "./IMakeFileConfigObjectOptions";

export type IMakeFileConfig = {
  (options: IMakeFileConfigObjectOptions): IConfigFile;
};
