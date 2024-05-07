"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
(async function() {
    const { displayA } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("../packages/a/src")));
    console.log(displayA());
})();
