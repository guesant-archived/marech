# marech

Ultimate, simple, powerful and extensible precompiler.

## Install & Usage

### CLI

#### Install CLI

```sh
npm install marech-cli
```

#### Setup the `marech.config.js` file

```ts
// marech.config.js

const { generateConfig } = require("marech-cli");

module.exports = generateConfig(__dirname, {
  output: "./build",
  input: { path: "./src/website", match: "**/*.html" },
  // rules: {
  //   // prettier: { enabled: false, options: {} },
  //   // htmlMinifier: { enabled: false, options: {} },
  //   // mappedPaths: { "@/(**)": join(__dirname, "./src/$1") },
  // },
});
```

#### Build the project

```sh
npx marech build [-p marech.config.js]
```

#### watch mode

```sh
npx marech build --watch [-p marech.config.js]
```

Use the flag `--watchConfig` to watch the `marech.config.js` file.

Have fun!

## Features

### Core

- AbstractFileSystem.

- AbstractTransformer.

### Command-Line Interface

- Follows [marech.config.js](#cli).

- `marech build` and `marech build --watch`.

## See also

Greats projects used or that have inspired the marech project:

- [Sergey](https://github.com/trys/sergey)

- [Webpack](https://webpack.js.org)

- [Prettier](https://prettier.io)

## License

- MIT - see [LICENSE.mit.txt](LICENSE.mit.txt) or <https://opensource.org/licenses/MIT>

## Author

- Gabriel Rodrigues - <https://github.com/guesant>
