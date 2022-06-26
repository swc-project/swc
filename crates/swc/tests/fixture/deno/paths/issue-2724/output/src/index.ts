"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async function() {
    const { displayA  } = await Promise.resolve("../packages/a/src/index").then((p)=>_interopRequireWildcard(require(p)));
    console.log(displayA());
})();
