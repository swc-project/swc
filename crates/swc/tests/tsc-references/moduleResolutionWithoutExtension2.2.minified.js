//// [moduleResolutionWithoutExtension2.ts]
//// [/src/buzz.mts]
// Extensionless relative path cjs import in an ES module
import { createRequire as _createRequire } from "module";
_createRequire(import.meta.url)("./foo") // should error, should not ask for extension
;
