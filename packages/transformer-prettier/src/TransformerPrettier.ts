import { AbstractTransformer } from "marech-core";
import prettier from "prettier";
import { ITransformerPrettierOptions } from "./ITransformerPrettierOptions";

export class TransformerPrettier extends AbstractTransformer<ITransformerPrettierOptions> {
  async transform() {
    return Buffer.from(
      prettier.format(this.originalFileContent.toString("utf8"), this.options),
    );
  }
}
