"use strict";
const _interopRequireWildcardMjs = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs").default;
(async function() {
    const { displayA  } = await Promise.resolve("../packages/a/src/index").then((p)=>_interopRequireWildcardMjs(require(p)));
    console.log(displayA());
})();
