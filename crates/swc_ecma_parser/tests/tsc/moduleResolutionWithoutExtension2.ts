// @moduleResolution: node16
// @module: node16

// @filename: /src/buzz.mts
// Extensionless relative path cjs import in an ES module
import foo = require("./foo"); // should error, should not ask for extension