import { AbstractTransformer } from "marech-core";
import { IDependencyGraphList } from "./IDependencyGraphList";

export type IConfigRule = {
  match: string;
  getTransformer: (
    {
      filePath,
      fileContent,
      dependencyGraph,
    }: {
      filePath: string;
      fileContent: Buffer;
      dependencyGraph?: IDependencyGraphList;
    },
    configRules?: IConfigRule[],
  ) => AbstractTransformer;
};
