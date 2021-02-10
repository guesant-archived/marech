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
  let newFileContent = originalFileContent;
  const rules = ConfigParserUtils.getMatchedRules(filePath, configRules);
  for (const { getTransformer } of rules) {
    const transformer = getTransformer(
      { filePath, fileContent: newFileContent, dependencyGraph },
      configRules,
    );
    if (typeof transformer.transform !== "function") {
      Logger.error("invalid transformer: ", transformer);
    } else {
      newFileContent = await Promise.resolve(transformer.transform());
    }
  }
  return newFileContent;
};
