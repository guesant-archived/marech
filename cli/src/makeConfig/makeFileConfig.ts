import escapeStringRegexp from "escape-string-regexp";
import { join, normalize } from "path";
import { IConfigFile } from "../types/IConfigFile";
import { IMakeFileConfig } from "../types/IMakeFileConfig";
import { IMakeFileConfigObjectOptions } from "../types/IMakeFileConfigObjectOptions";

export class MakeFileConfig {
  static makeFileConfig = function (): IConfigFile | null {
    const [
      outputPath,
      inputPath,
      inputMatch = undefined,
    ] = MakeFileConfig.extractPathsFromArgs(Array.from(arguments));
    return outputPath
      ? MakeFileConfig.buildFileConfig(outputPath, inputPath!, inputMatch)
      : null;
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

  static extractPathsFromArgs = (
    args: any[],
  ): [null] | [string, string, string] | [string, string] => {
    if (args.length === 1) {
      const options = args[0] as IMakeFileConfigObjectOptions;
      const { match, inputPath, outputPath } = options;
      return [outputPath, inputPath, match];
    } else if (args.length === 2) {
      if (Array.isArray(args[1])) {
        const [inputPath, inputMatch] = args[1] as [string, string];
        return [args[0], inputPath, inputMatch];
      } else if (typeof args[1] === "string") {
        return [args[0], args[1]];
      }
    }
    return [null];
  };
}
