//// [moduleResolutionWithoutExtension2.ts]
//// [/src/buzz.mts]
import { createRequire as _createRequire } from "module";
var __require = _createRequire(import.meta.url);
// Extensionless relative path cjs import in an ES module
var foo = __require("./foo"); // should error, should not ask for extension
