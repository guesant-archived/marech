import { minify } from "html-minifier";
import { AbstractTransformer } from "marech-core";
import { ITransformerHTMLMinifierOptions } from "./ITransformerHTMLMinifierOptions";

export class TransformerHTMLMinifier extends AbstractTransformer<ITransformerHTMLMinifierOptions> {
  async transform() {
    return Buffer.from(
      minify(this.originalFileContent.toString("utf8"), this.options),
    );
  }
}
