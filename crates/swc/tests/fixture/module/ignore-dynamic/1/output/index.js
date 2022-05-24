"use strict";
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _foo = _interop_require_wildcard(require("foo"));
async function foo() {
    await import("foo");
    callback(()=>import("foo"));
}
import("side-effect");
await import("awaited");
