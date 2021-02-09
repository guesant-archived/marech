import { parseDocument } from "htmlparser2";

export const getDOM = (html: string) =>
  parseDocument(html, { recognizeSelfClosing: true });
