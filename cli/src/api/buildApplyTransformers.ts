import { ConfigParserUtils } from "../ConfigParserUtils";
import { Logger } from "../Logger";
import { IConfigParsed } from "../types/IConfigParsed";
import { IDependencyGraphList } from "../types/IDependencyGraphList";

export const buildApplyTransformers = async (
  originalFileContent: Buffer,
  filePath: string,
  { rules: configRules }: { rules: IConfigParsed["rules"] },
  dependencyGraph?: IDependencyGraphList,
) => {
  let currentFileContent = originalFileContent;
  const rules = ConfigParserUtils.getMatchedRules(filePath, configRules);
  for (const { getTransformer } of rules) {
    const transformer = getTransformer(
      { filePath, fileContent: currentFileContent, dependencyGraph },
      configRules,
    );
    if (typeof transformer.transform !== "function") {
      Logger.error("invalid transformer: ", transformer);
    } else {
      currentFileContent = await Promise.resolve(transformer.transform());
    }
  }
  return currentFileContent;
};
