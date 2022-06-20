"use strict";
var _interop_require_wildcard = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs").default;
var _interopRequireWildcardMjs = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs");
(async function() {
    const { displayA  } = await Promise.resolve("@print/a").then(function(p) {
        return _interop_require_wildcard(require(p));
    });
    console.log(displayA());
})();
