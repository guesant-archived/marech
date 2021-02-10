# marech

Ultimate, simple, powerful and extensible precompiler.

## Examples

### CLI

#### Install CLI

```sh
npm install marech-cli
```

#### Setup the `marech.config.js`

```ts
// marech.config.js

const { generateConfig } = require("marech-cli");

module.exports = generateConfig(__dirname, {
  output: "./build",
  input: { path: "./src/website", match: "**/*.html" },
});
```

#### Build the project

```
npx marech build [-p marech.config.js]
```

#### watch mode

```
npx marech build --watch [-p marech.config.js]
```

Have fun!

## Features

### Core

- AbstractFileSystem.

- AbstractTransformer.

### Command-Line Interface

- Follows [marech.config.js](#cli).

- `marech build` and `marech build --watch`.

## License

- MIT - see [LICENSE.mit.txt](LICENSE.mit.txt) or <https://opensource.org/licenses/MIT>

## Author

- Gabriel Rodrigues - <https://github.com/guesant>
