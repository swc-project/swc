// @moduleResolution: node16
// @module: node16

// @filename: /src/bar.cts
// Extensionless relative path cjs import in a cjs module
import foo = require("./foo"); // should error, should not ask for extension