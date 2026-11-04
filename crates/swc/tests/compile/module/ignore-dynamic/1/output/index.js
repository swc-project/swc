"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _foo = /*#__PURE__*/ _interop_require_default._(require("foo"));
async function foo() {
    await import("foo");
    callback(()=>import("foo"));
}
import("side-effect");
await import("awaited");
