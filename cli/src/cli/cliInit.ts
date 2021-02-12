const { Input } = require("enquirer");
import { write } from "fs-jetpack";
import { normalize } from "path";
const { Select } = require("enquirer");

const configFileWithGenerateConfig = (
  outputPath: string,
  inputPath: string,
  inputMatch: string,
) => `const { generateConfig } = require("marech-cli");

module.exports = generateConfig(__dirname, {
  output: ${JSON.stringify(outputPath)},
  input: { path: ${JSON.stringify(inputPath)}, match: ${JSON.stringify(
  inputMatch,
)} },
  rules: {}
});
`;

const configFilePlainJavascript = (
  outputPath: string,
  inputPath: string,
  inputMatch: string,
) => `const { relative } = require("path");

module.exports = {
  files: {
    input: {
      path: ${JSON.stringify(normalize(inputPath))},
      match: ${JSON.stringify(inputMatch)}
    },
    output: {
      path: ${JSON.stringify(outputPath)},
      filename: ({ filePath }) => relative(${JSON.stringify(
        normalize(inputPath),
      )}, filePath)
    },
  },
  rules: []
};
`;

export const cliInit = async () => {
  try {
    const inputPath = await new Input({
      message: "Input path",
      initial: "./src/website",
    }).run();

    const inputMatch = await new Input({
      message: "Files that matches",
      initial: "**/*.html",
    }).run();

    const outputPath = await new Input({
      message: "To the output path",
      initial: "./build",
    }).run();

    const configFilename = await new Input({
      message: "Config filename",
      initial: "marech.config.js",
    }).run();

    const configFileType = await new Select({
      name: "color",
      message: "Do you want to use generateConfig?",
      choices: [
        {
          name: "no",
          message: "No, use plain javascript",
          value: false,
        },
        {
          name: "yes",
          message: "Use generateConfig",
          value: true,
        },
      ],
    }).run();

    const config = (configFileType === "yes"
      ? configFileWithGenerateConfig
      : configFilePlainJavascript)(outputPath, inputPath, inputMatch);

    write(configFilename, config);
    console.log("");
    console.log("[info]", `created ${configFilename} config file.`);
  } catch (_) {}
};
