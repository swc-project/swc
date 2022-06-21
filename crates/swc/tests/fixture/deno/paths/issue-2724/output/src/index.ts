"use strict";
var _interop_require_wildcard = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs").default;
var _interopRequireWildcardMjs = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs");
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async function() {
    const { displayA  } = await Promise.resolve("../packages/a/src/index").then((p)=>_interopRequireWildcardMjs(require(p)));
    console.log(displayA());
})();
