import jetpack from "fs-jetpack";
import { AbstractFileSystem } from "marech-core";
import mm from "micromatch";
import { isAbsolute, join } from "path";
import { buildApplyTransformers } from "../api/buildApplyTransformers";
import { Logger } from "../Logger";
import { IConfigRule } from "../types";
import { IDependencyGraph } from "../types/IDependencyGraph";
import { IDependencyGraphList } from "../types/IDependencyGraphList";
import { IMakeFileSystemMappedPaths } from "../types/IMakeFileSystemMappedPaths";

const getTargetPath = (
  mappedPathsObject: IMakeFileSystemMappedPaths,
  path: string,
) => {
  const [pattern, replacer] =
    Object.entries(mappedPathsObject).find(([pattern]) =>
      mm.isMatch(path, pattern),
    ) || [];
  return pattern && replacer
    ? path.replace(mm.makeRe(pattern), replacer)
    : path;
};

export const makeFileSystem = (
  currentDir: string,
  mappedPathsObject: IMakeFileSystemMappedPaths = {},
  configRules: IConfigRule[] = [],
  dependencyGraph?: IDependencyGraphList,
): AbstractFileSystem => {
  const fs = jetpack.cwd(currentDir);

  const read = async (path: string, returnAs?: "utf8" | "buffer") => {
    const targetPath = getTargetPath(mappedPathsObject, path);

    const absoluteTargetPath =
      fs.inspect(targetPath)?.absolutePath || isAbsolute(targetPath)
        ? targetPath
        : join(currentDir, targetPath);

    const requestedPathGraph: IDependencyGraph = {
      path: absoluteTargetPath,
      read: [],
    };

    if (fs.exists(targetPath)) {
      const originalFileContent = fs.read(targetPath, "buffer")!;

      const newFileContent = await buildApplyTransformers(
        originalFileContent,
        absoluteTargetPath,
        { rules: configRules },
        requestedPathGraph.read,
      );

      dependencyGraph?.push(requestedPathGraph);

      switch (returnAs) {
        case "buffer":
          return newFileContent;
        case "utf8":
        default:
          return newFileContent.toString("utf8");
      }
    } else {
      Logger.error(
        "fs.read: invalid read path:",
        targetPath,
        "from",
        currentDir,
      );
      switch (returnAs) {
        case "buffer":
          return Buffer.from("");
        case "utf8":
        default:
          return "";
      }
    }
  };

  return {
    read: read as AbstractFileSystem["read"],
  };
};
