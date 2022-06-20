"use strict";
var _interop_require_wildcard = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs").default;
var _interopRequireWildcardMjs = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs");
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
(async function() {
    const { displayA  } = await Promise.resolve("../packages/a/src/index").then((p)=>(0, _interopRequireWildcardMjs.default)(require(p)));
    console.log(displayA());
})();
