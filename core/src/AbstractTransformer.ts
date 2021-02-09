import { AbstractFileSystem } from "./AbstractFileSystem";
import { ITransformerDependencies } from "./types/ITransformerDependencies";

export abstract class AbstractTransformer<
  TransformerOptions extends object = {},
  TransformerDependencies extends ITransformerDependencies = ITransformerDependencies,
  OriginalFileContent = Buffer
> {
  fs: AbstractFileSystem;
  constructor(
    public originalFileContent: OriginalFileContent,
    dependencies: TransformerDependencies,
    public options: TransformerOptions,
  ) {
    this.fs = dependencies.fs;
  }
  abstract transform(): Promise<Buffer>;
}
