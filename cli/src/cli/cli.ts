import { Command } from "commander";
import { ConfigParser } from "../ConfigParser";
const { version } = require("../../package.json");

async function main(args: string[]) {
  const program = new Command();

  program.version(version);

  program.parse(args);
}

main(process.argv);
