import chokidar from "chokidar";
import { format } from "date-fns";
import jetpack from "fs-jetpack";
import { join } from "path";
import { buildApplyTransformersByFilename } from "../api/buildApplyTransformersByFilename";
import { buildByConfig } from "../api/buildByConfig";
import { ConfigParser } from "../ConfigParser";
import { ConfigParserUtils } from "../ConfigParserUtils";
import { IConfigFile, IConfigParsed } from "../types";
import { extractDependencyGraphListPaths } from "./extractDependencyGraphListPaths";

export type IFileWatchEvent = "add" | "change" | "unlink";

const logInfo = (message: string) => {
  console.log(`[${format(Date.now(), "H:mm:ss")}]`, message);
};

const handleFileEvents = (
  cleanupFunctionMap: Map<string, () => Promise<any>>,
  config: IConfigParsed,
  fileConfig: IConfigFile,
) => async (eventName: IFileWatchEvent, path: string) => {
  if (cleanupFunctionMap.has(path)) {
    await cleanupFunctionMap.get(path)!();
    cleanupFunctionMap.delete(path);
  }
  switch (eventName) {
    case "unlink":
      jetpack.remove(ConfigParserUtils.getOutputPath(fileConfig)(path));
      break;
    default:
      logInfo(`File change detected. Starting incremental compilation...`);

      const fileDependencyGraph = await buildApplyTransformersByFilename(
        path,
        fileConfig,
        config!,
      );

      logInfo("Watching for file changes.");

      const dependenciesWatcher = chokidar.watch(
        extractDependencyGraphListPaths(fileDependencyGraph),
      );

      const handleDependencyChange = async () => {
        await handleFileEvents(
          cleanupFunctionMap,
          config,
          fileConfig,
        )("change", path);
        await dependenciesWatcher.close();
      };

      dependenciesWatcher.once("change", handleDependencyChange);
      dependenciesWatcher.once("unlink", handleDependencyChange);

      cleanupFunctionMap.set(path, () => dependenciesWatcher.close());
      break;
  }
};

export async function cliBuild({
  watchMode,
  watchConfigFile,
  configPath,
}: {
  configPath: string;
  watchConfigFile?: boolean;
  watchMode?: boolean;
}) {
  let isBuilding = false;
  let cleanupFunctions: (() => any)[] = [];

  async function buildProcess() {
    if (isBuilding) return;
    isBuilding = true;
    for (const callback of cleanupFunctions) {
      await Promise.resolve(callback());
    }
    cleanupFunctions = [];
    const config = ConfigParser.loadConfig(
      configPath,
      ConfigParser.DEFAULT_CONFIG_FILENAME,
    );
    if (config) {
      if (!watchMode) {
        await buildByConfig(config);
        return;
      } else {
        logInfo("Starting compilation in watch mode...");
        for (const fileConfig of config.files) {
          const {
            input: { path, match },
          } = fileConfig;
          const watcher = chokidar.watch(join(path, ...(match ? [match] : [])));
          const cleanupFilesMap = new Map<string, () => Promise<any>>();
          watcher.on(
            "all",
            handleFileEvents(cleanupFilesMap, config, fileConfig),
          );
          cleanupFunctions.push(() => watcher.close());
        }
      }
    }
    isBuilding = false;
  }

  if (!watchConfigFile) {
    await buildProcess();
  } else {
    logInfo(`Watching for the config file: ${configPath}`);
    const configWatcher = chokidar.watch(configPath);
    configWatcher.on("all", async (eventName) => {
      switch (eventName) {
        case "change":
          logInfo(`Config file changed. Rebuilding the project.`);
        case "add":
        case "change":
          await buildProcess();
      }
    });
  }
}
