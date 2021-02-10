import chokidar from "chokidar";
import jetpack from "fs-jetpack";
import debounce from "lodash.debounce";
import { buildApplyTransformersByFilename } from "../api/buildApplyTransformersByFilename";
import { buildByConfig } from "../api/buildByConfig";
import { ConfigParser } from "../ConfigParser";
import { ConfigParserUtils } from "../ConfigParserUtils";
import { extractDependencyGraphListPaths } from "./extractDependencyGraphListPaths";

export type IFileWatchEvent = "add" | "change" | "unlink";

const logInfo = debounce((message: string) => {
  process.stdout.write("\r".padEnd(80, " "));
  process.stdout.write(message);
}, 0);

export async function cliBuild({
  watchMode,
  configPath,
}: {
  configPath: string;
  watchMode?: boolean;
}) {
  const config = ConfigParser.loadConfig(
    configPath,
    ConfigParser.DEFAULT_CONFIG_FILENAME,
  );

  if (config) {
    if (watchMode) {
      logInfo(`\rStarting compilation in watch mode...`);

      for (const fileConfig of config.files) {
        const watcher = chokidar.watch(fileConfig.input);
        const cleanupFunctionMap = new Map<string, () => Promise<any>>();

        const handleFileEvents = async (
          eventName: IFileWatchEvent,
          path: string,
        ) => {
          if (cleanupFunctionMap.has(path)) {
            await cleanupFunctionMap.get(path)!();
            cleanupFunctionMap.delete(path);
          }
          switch (eventName) {
            case "unlink":
              jetpack.remove(ConfigParserUtils.getOutputPath(fileConfig)(path));
              break;
            default:
              logInfo(
                `\rFile change detected. Starting incremental compilation...`,
              );

              const fileDependencyGraph = await buildApplyTransformersByFilename(
                path,
                fileConfig,
                config!,
              );

              logInfo(`\rWatching for file changes.`);

              const dependenciesWatcher = chokidar.watch(
                extractDependencyGraphListPaths(fileDependencyGraph),
              );

              const handleDependencyChange = async () => {
                await handleFileEvents("change", path);
                await dependenciesWatcher.close();
              };

              dependenciesWatcher.once("change", handleDependencyChange);
              dependenciesWatcher.once("unlink", handleDependencyChange);

              cleanupFunctionMap.set(path, () => dependenciesWatcher.close());
              break;
          }
        };

        watcher.on("all", handleFileEvents);
      }
    } else {
      await buildByConfig(config);
    }
  }
}
