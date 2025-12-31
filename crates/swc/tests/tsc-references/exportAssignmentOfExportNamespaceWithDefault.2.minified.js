//// [main.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), (0, /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("a")).default)();
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
