import jetpack from "fs-jetpack";
import { ConfigParserUtils } from "../ConfigParserUtils";
import { Logger } from "../Logger";
import { IConfigFile } from "../types";
import { IConfigParsed } from "../types/IConfigParsed";
import { IDependencyGraphList } from "../types/IDependencyGraphList";
import { buildApplyTransformers } from "./buildApplyTransformers";

export const buildApplyTransformersByFilename = async (
  filePath: string,
  fileConfig: IConfigFile,
  config: IConfigParsed,
) => {
  const fileDependencyGraph: IDependencyGraphList = [];
  Logger.debug("read", filePath);
  if (jetpack.exists(filePath)) {
    const originalFileContent = jetpack.read(filePath, "buffer")!;
    const outputFilename = ConfigParserUtils.getOutputPath(fileConfig)(
      filePath,
    );
    const newFileContent = await buildApplyTransformers(
      originalFileContent,
      filePath,
      config,
      fileDependencyGraph,
    );
    jetpack.write(outputFilename, newFileContent);
    Logger.debug("write", outputFilename);
  }
  return fileDependencyGraph;
};
