import jetpack from "fs-jetpack";
import { AbstractFileSystem } from "marech-core";
import mm from "micromatch";
import { IMakeFileSystemMappedPaths } from "../types/IMakeFileSystemMappedPaths";

export const makeFileSystem = (
  currentDir: string,
  mappedPathsObject: IMakeFileSystemMappedPaths = {},
): AbstractFileSystem => {
  const fs = jetpack.cwd(currentDir);

  const read = (path: string, returnAs?: "utf8" | "buffer") => {
    return ((targetPath: string) =>
      Promise.resolve(fs.read(targetPath, returnAs as any)))(
      (() => {
        const [pattern, replacer] =
          Object.entries(mappedPathsObject).find(([pattern]) =>
            mm.isMatch(path, pattern),
          ) || [];
        return pattern && replacer
          ? path.replace(mm.makeRe(pattern), replacer)
          : path;
      })(),
    );
  };

  return {
    read: read as AbstractFileSystem["read"],
  };
};
