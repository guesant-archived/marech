import jetpack from "fs-jetpack";
import { ConfigParserUtils } from "../ConfigParserUtils";
import { Logger } from "../Logger";
import { IConfigFile } from "../types";
import { IConfigParsed } from "../types/IConfigParsed";
import { buildApplyTransformers } from "./buildApplyTransformers";

export const buildApplyTransformersByFilename = async (
  filePath: string,
  fileConfig: IConfigFile,
  config: IConfigParsed,
) => {
  const originalFileContent = jetpack.read(filePath, "buffer");
  if (!originalFileContent) return;
  Logger.debug("read", filePath);
  const outputFilename = ConfigParserUtils.getOutputPath(fileConfig)(filePath);
  jetpack.write(
    outputFilename,
    await buildApplyTransformers(originalFileContent, filePath, config),
  );
  Logger.debug("write", outputFilename);
};
