# marech

Ultimate, simple, powerful and extensible precompiler.

## Examples

### CLI

#### Create the config file

```js
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

## License

- MIT - see [LICENSE.mit.txt](LICENSE.mit.txt) or <https://opensource.org/licenses/MIT>

## Author

- Gabriel Rodrigues - <https://github.com/guesant>
