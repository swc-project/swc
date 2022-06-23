"use strict";
const _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
const _foo = _interopRequireDefaultMjs(require("foo"));
async function foo() {
    await import("foo");
    callback(()=>import("foo"));
}
import("side-effect");
await import("awaited");
