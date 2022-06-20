"use strict";
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
var _foo = _interop_require_default(require("foo"));
async function foo() {
    await import("foo");
    callback(()=>import("foo"));
}
import("side-effect");
await import("awaited");
