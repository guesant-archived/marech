import { Node } from "domhandler";
import { getAttribute } from "./getAttribute";

export const getNamedSelector = <FilterNode extends Node>({
  baseSelector,
  attributeName,
  attributeValue,
  attributeDefaultValue = "default",
}: IGetNamedSelectorOptions) => {
  return [
    [
      `${baseSelector}[${attributeName}="${attributeValue}"]`,
      baseSelector,
    ].join(", "),
    (el: FilterNode) =>
      getAttribute(el, attributeName, attributeDefaultValue) === attributeValue,
  ] as const;
};

export type IGetNamedSelectorOptions = {
  baseSelector: string;
  attributeName: string;
  attributeValue: string;
  attributeDefaultValue?: string;
};
