import { IDependencyGraphList } from "../types/IDependencyGraphList";

export const extractDependencyGraphListPaths = (list: IDependencyGraphList) => {
  const paths: string[] = [];
  for (const { path, read } of list) {
    paths.push(path);
    paths.push(...extractDependencyGraphListPaths(read));
  }
  return paths;
};
