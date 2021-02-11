import { ITransformerHTMLMinifierOptions } from "@guesant/marech-transformer-html-minifier";
import { IConfigRule } from "./IConfigRule";
import { IMakeFileSystemMappedPaths } from "./IMakeFileSystemMappedPaths";

export type IRulesPresetOptions = {
  mappedPaths?: IMakeFileSystemMappedPaths;
  htmlImport?: {
    match?: IConfigRule["match"];
    enabled?: boolean;
  };
  htmlMinify?: {
    match?: IConfigRule["match"];
    enabled?: boolean;
    options: ITransformerHTMLMinifierOptions;
  };
};
