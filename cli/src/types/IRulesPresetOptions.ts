import { IConfigRule } from "./IConfigRule";
import { IMakeFileSystemMappedPaths } from "./IMakeFileSystemMappedPaths";

export type IRulesPresetOptions = {
  mappedPaths?: IMakeFileSystemMappedPaths;
  htmlImport?: {
    match?: IConfigRule["match"];
    enabled?: boolean;
  };
};
