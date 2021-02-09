import { IConfigFile } from "./IConfigFile";
import { IMakeFileConfigObjectOptions } from "./IMakeFileConfigObjectOptions";

export type IMakeFileConfig = {
  (outputPath: string, inputPath: string): IConfigFile;
  (outputPath: string, [inputPath, inputMatch]: [string, string]): IConfigFile;
  (options: IMakeFileConfigObjectOptions): IConfigFile;
};
