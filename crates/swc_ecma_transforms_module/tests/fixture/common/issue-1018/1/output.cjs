"use strict";
async function foo() {
    await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("foo")));
}
