"use strict";
const _interopRequireWildcard = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs").default;
(async function() {
    const { displayA  } = await Promise.resolve("../packages/a/src/index").then((p)=>_interopRequireWildcard(require(p)));
    console.log(displayA());
})();
