import globby from "globby";
import lodashChunk from "lodash.chunk";
import { Logger } from "../Logger";
import { IConfigParsed } from "../types/IConfigParsed";
import { buildApplyTransformersByFilename } from "./buildApplyTransformersByFilename";

export const findMatchedFiles = async (path: string) =>
  (await globby(path).catch(() => [])) || [];

export const buildByConfig = async (config: IConfigParsed) => {
  for (const fileConfig of config.files) {
    Logger.debug("loading config", fileConfig.input);
    const chunks = lodashChunk(await findMatchedFiles(fileConfig.input), 10)!;
    for (const chunk of chunks) {
      await Promise.all([
        ...chunk.map(async (filePath) => {
          await buildApplyTransformersByFilename(filePath, fileConfig, config);
        }),
      ]);
    }
  }
};
