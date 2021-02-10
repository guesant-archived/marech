import escapeStringRegexp from "escape-string-regexp";
import { join, normalize } from "path";
import { IConfigFile } from "../types/IConfigFile";
import { IMakeFileConfigObjectOptions } from "../types/IMakeFileConfigObjectOptions";

const extractInputPathMatch = (input: IMakeFileConfigObjectOptions["input"]) =>
  typeof input === "string"
    ? ([input, undefined] as const)
    : ([input.path, input.match] as const);
export class MakeFileConfig {
  static makeFileConfig = (
    currentPath: string,
    { input, output }: IMakeFileConfigObjectOptions,
  ): IConfigFile | null => {
    const [path, match] = extractInputPathMatch(input);
    return output
      ? MakeFileConfig.buildFileConfig(output, join(currentPath, path), match)
      : null;
  };

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
