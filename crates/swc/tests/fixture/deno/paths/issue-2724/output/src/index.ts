"use strict";
const _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async function() {
    const { displayA  } = await Promise.resolve("../packages/a/src/index").then((p)=>_interopRequireWildcardMjs(require(p)));
    console.log(displayA());
})();
