// @module: commonjs
// @importHelpers: true
// @esModuleInterop: true
// @noTypesAndSymbols: true
// @Filename: a.ts
export { };
// @Filename: b.ts
import * as _ns from "./a"; // Error
export { _ns as ns };
