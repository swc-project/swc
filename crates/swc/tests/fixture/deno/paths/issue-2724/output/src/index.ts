"use strict";
var _interop_require_wildcard = require("../../../../../../../../../packages/swc-helpers/src/_interop_require_wildcard.mjs").default;
(async function() {
    const { displayA  } = await Promise.resolve().then(function() {
        return _interop_require_wildcard(require("../packages/a/src/index"));
    });
    console.log(displayA());
})();
