import jetpack from "fs-jetpack";
import { AbstractFileSystem } from "marech-core";
import mm from "micromatch";
import { buildApplyTransformers } from "../api/buildApplyTransformers";
import { Logger } from "../Logger";
import { IConfigRule } from "../types";
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
): AbstractFileSystem => {
  const fs = jetpack.cwd(currentDir);

  const read = async (path: string, returnAs?: "utf8" | "buffer") => {
    const targetPath = getTargetPath(mappedPathsObject, path);

    if (!fs.exists(targetPath)) {
      Logger.error(
        "fs.read: invalid read path:",
        targetPath,
        "from",
        currentDir,
      );
    }

    const originalFileContent = fs.read(targetPath, "buffer")!;

    const newFileContent = await buildApplyTransformers(
      originalFileContent,
      targetPath,
      { rules: configRules },
    );

    switch (returnAs) {
      case "buffer":
        return newFileContent;
      case "utf8":
      default:
        return newFileContent.toString("utf8");
    }
  };

  return {
    read: read as AbstractFileSystem["read"],
  };
};
