//// [moduleResolutionWithoutExtension2.ts]
//// [/src/buzz.mts]
// Extensionless relative path cjs import in an ES module
import { createRequire as _createRequire } from "module";
var __require = _createRequire(import.meta.url);
var foo = __require("./foo") // should error, should not ask for extension
;
