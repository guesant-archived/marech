import globby from "globby";
import lodashChunk from "lodash.chunk";
import { join } from "path";
import { Logger } from "../Logger";
import { IConfigFile } from "../types";
import { IConfigParsed } from "../types/IConfigParsed";
import { IDependencyGraphList } from "../types/IDependencyGraphList";
import { buildApplyTransformersByFilename } from "./buildApplyTransformersByFilename";

export const findMatchedFiles = async ({
  input: { path, match },
}: IConfigFile) =>
  (await globby(join(path, ...(match ? [match] : []))).catch(() => [])) || [];

export const buildByConfig = async (config: IConfigParsed) => {
  const dependencyGraph: IDependencyGraphList = [];
  for (const fileConfig of config.files) {
    Logger.debug("loading config", fileConfig.input);
    const chunks = lodashChunk(await findMatchedFiles(fileConfig), 10)!;
    for (const chunk of chunks) {
      await Promise.all([
        ...chunk.map(async (filePath) => {
          const fileDependencyGraphList = await buildApplyTransformersByFilename(
            filePath,
            fileConfig,
            config,
          );
          dependencyGraph.push({
            path: filePath,
            read: fileDependencyGraphList,
          });
        }),
      ]);
    }
  }
  return dependencyGraph;
};
