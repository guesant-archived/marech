import escapeStringRegexp from "escape-string-regexp";
import { join, normalize } from "path";
import { IConfigFile } from "../types/IConfigFile";
import { IMakeFileConfig } from "../types/IMakeFileConfig";
import { IMakeFileConfigObjectOptions } from "../types/IMakeFileConfigObjectOptions";

export class MakeFileConfig {
  static makeFileConfig = function ({
    input,
    output,
  }: IMakeFileConfigObjectOptions): IConfigFile | null {
    const [path, match] = (() => {
      return typeof input === "string"
        ? ([input, undefined] as const)
        : ([input.path, input.match] as const);
    })();
    return output ? MakeFileConfig.buildFileConfig(output, path, match) : null;
  } as IMakeFileConfig;

  static buildFileConfig = (
    outputPath: string,
    inputPath: string,
    inputMatch?: string,
  ): IConfigFile => {
    return {
      input: join(normalize(inputPath), ...(inputMatch ? [inputMatch] : [])),
      output: {
        path: outputPath,
        filename: inputMatch
          ? ({ filePath }) =>
              normalize(filePath).replace(
                new RegExp(`^${escapeStringRegexp(normalize(inputPath))}`),
                "",
              )
          : ({ filePath }) => filePath,
      },
    };
  };
}
