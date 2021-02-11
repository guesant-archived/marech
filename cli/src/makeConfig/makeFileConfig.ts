import { join, normalize, relative } from "path";
import { IConfigFile } from "../types/IConfigFile";
import { IMakeFileConfigObjectOptions } from "../types/IMakeFileConfigObjectOptions";

const extractInputPathMatch = (input: IMakeFileConfigObjectOptions["input"]) =>
  typeof input === "string"
    ? ([input, undefined] as const)
    : ([input.path, input.match] as const);
export class MakeFileConfig {
  static extractInputPaths = (
    currentPath: string,
    { input, output }: IMakeFileConfigObjectOptions,
  ) => {
    const [path, match] = extractInputPathMatch(input);
    return output
      ? [
          join(currentPath, output),
          join(currentPath, path),
          ...(match ? [match] : []),
        ]
      : null;
  };

  static makeFileConfig = (
    currentPath: string,
    options: IMakeFileConfigObjectOptions,
  ): IConfigFile | null => {
    const extracted = MakeFileConfig.extractInputPaths(currentPath, options);
    return extracted
      ? MakeFileConfig.buildFileConfig(extracted[0], extracted[1], extracted[2])
      : null;
  };

  static buildFileConfig = (
    outputPath: string,
    inputPath: string,
    inputMatch?: string,
  ): IConfigFile => {
    return {
      input: {
        path: normalize(inputPath),
        ...(inputMatch ? { match: inputMatch } : {}),
      },
      output: {
        path: outputPath,
        filename: inputMatch
          ? ({ filePath }) => relative(inputPath, filePath)
          : ({ filePath }) => filePath,
      },
    };
  };
}
