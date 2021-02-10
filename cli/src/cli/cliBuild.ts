import { buildByConfig } from "../api/buildByConfig";
import { ConfigParser } from "../ConfigParser";

export async function cliBuild({ configPath }: { configPath: string }) {
  const config = ConfigParser.loadConfig(
    configPath,
    ConfigParser.DEFAULT_CONFIG_FILENAME,
  );
  if (config) {
    await buildByConfig(config);
  }
}
