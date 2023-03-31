"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async function() {
    const { displayA  } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("../packages/a/src/index")));
    console.log(displayA());
})();
