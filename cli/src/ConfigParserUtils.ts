import micromatch from "micromatch";
import { basename, join } from "path";
import { IConfigFile } from "./types/IConfigFile";
import { IConfigRule } from "./types/IConfigRule";

export class ConfigParserUtils {
  static getMatchedRules = (filePath: string, rules: IConfigRule[]) => {
    return rules.filter(({ match }) => micromatch.isMatch(filePath, match));
  };

  static getOutputPath = ({ output: { path, filename } }: IConfigFile) => (
    filePath: string,
  ) => {
    const [outputDir, outputFile] = (() => [
      path || process.cwd(),
      typeof filename === "string"
        ? filename
        : typeof filename === "function"
        ? filename({ filePath, fileName: basename(filePath) })
        : basename(filePath),
    ])();
    return join(outputDir, outputFile);
  };
}
