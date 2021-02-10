import { Command } from "commander";
import { ConfigParser } from "../ConfigParser";
import { cliBuild } from "./cliBuild";
const { version } = require("../../package.json");

async function main(args: string[]) {
  const program = new Command();

  program.version(version);

  program.option(
    "-p, --config <path>",
    "Compile the project given the path to its configuration file, or to a folder with a 'marech.config.js'.",
    ConfigParser.DEFAULT_CONFIG_FILENAME
  );

  program.option("--watch", "Watches for file changes.", false);
  program.option("--watchConfig", "Watches for the config file.", false);

  program
    .command("build")
    .description("build the project from config file")
    .action(() => {
      cliBuild({
        configPath: program.opts().config,
        watchMode: program.opts().watch,
        watchConfigFile: program.opts().watchConfig,
      });
    });

  program.parse(args);
}

main(process.argv);
