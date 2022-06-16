"use strict";
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async function() {
    const { displayA  } = await Promise.resolve().then(function() {
        return _interop_require_wildcard(require("../packages/a/src/index"));
    });
    console.log(displayA());
})();
