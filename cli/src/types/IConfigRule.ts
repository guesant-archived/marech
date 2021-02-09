import { AbstractTransformer } from "marech-core";

export type IConfigRule = {
  match: string;
  getTransformer: ({
    filePath,
    fileContent,
  }: {
    filePath: string;
    fileContent: Buffer;
  }) => AbstractTransformer;
};
