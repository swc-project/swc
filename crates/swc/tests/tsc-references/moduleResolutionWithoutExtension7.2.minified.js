//// [moduleResolutionWithoutExtension7.ts]
//// [/src/bar.cts]
// Extensionless relative path cjs import in a cjs module
import { createRequire as _createRequire } from "module";
_createRequire(import.meta.url)("./foo") // should error, should not ask for extension
;
