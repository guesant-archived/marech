import selectAll from "css-select";
import { Node } from "domhandler";
import { getNamedSelector, IGetNamedSelectorOptions } from "./getNamedSelector";

export const makeNamedSelection = <FilterNode extends Node>(
  dom: FilterNode,
  options: IGetNamedSelectorOptions
) => {
  const [query, filter] = getNamedSelector<FilterNode>(options);
  return selectAll(query, dom).filter(filter);
};
