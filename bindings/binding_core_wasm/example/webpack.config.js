const path = require("path");

module.exports = {
    entry: "./index.js",
    // Webpack 5 requires explicit support for wasm-pack's WebAssembly imports.
    experiments: {
        asyncWebAssembly: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    mode: "development",
};
