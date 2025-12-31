//// [main.ts]
// https://github.com/microsoft/TypeScript/issues/39149
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _a = /*#__PURE__*/ _interop_require_default._(require("a"));
(0, _a.default)();
//// [external.d.ts]
//!   x ESM-style module declarations are not permitted in a namespace.
//!    ,-[5:1]
//!  2 |     export function a(): void;
//!  3 |     export namespace a {
//!  4 |         var _a: typeof a;
//!  5 |         export { _a as default };
//!    :         ^^^^^^^^^^^^^^^^^^^^^^^^^
//!  6 |     }
//!  7 |     export default a;
//!  8 | }
//!    `----
