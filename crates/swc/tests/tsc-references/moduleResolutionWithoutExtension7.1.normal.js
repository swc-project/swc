//// [moduleResolutionWithoutExtension7.ts]
//// [/src/bar.cts]
// Extensionless relative path cjs import in a cjs module
import { createRequire as _createRequire } from "module";
var __require = _createRequire(import.meta.url);
var foo = __require("./foo") // should error, should not ask for extension
;
