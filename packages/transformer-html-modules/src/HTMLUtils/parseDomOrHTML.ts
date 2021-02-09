import { Document } from "domhandler";
import { getDOM } from "./getDOM";

export const parseDomOrHTML = (domOrHTML: string | Document) =>
  typeof domOrHTML === "string" ? getDOM(domOrHTML) : domOrHTML;
