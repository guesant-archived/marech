import { ConfigParserUtils } from "../ConfigParserUtils";
import { Logger } from "../Logger";
import { IConfigParsed } from "../types/IConfigParsed";

export const buildApplyTransformers = async (
  originalFileContent: Buffer,
  filePath: string,
  { rules: configRules }: { rules: IConfigParsed["rules"] },
) => {
  let currentFileContent = originalFileContent;
  const rules = ConfigParserUtils.getMatchedRules(filePath, configRules);
  for (const { getTransformer } of rules) {
    const transformer = getTransformer(
      { filePath, fileContent: currentFileContent },
      configRules,
    );
    if (typeof transformer.transform !== "function") {
      Logger.error("invalid transformer: ", transformer);
    } else {
      currentFileContent = await transformer.transform();
    }
  }
  return currentFileContent;
};
