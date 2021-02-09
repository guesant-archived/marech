import { Element, Node } from "domhandler";
import { getAttributeValue } from "domutils";

export const getAttribute = (
  el: Node | Element,
  name: string,
  defaultValue: string | undefined = undefined,
) => getAttributeValue(el as Element, name) || defaultValue;
