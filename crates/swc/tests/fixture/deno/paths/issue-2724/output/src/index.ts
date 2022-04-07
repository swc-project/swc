"use strict";
var swcHelpers = require("@swc/helpers");
(async function() {
    const { displayA  } = await Promise.resolve().then(function() {
        return swcHelpers.interopRequireWildcard(require("../packages/a/src/index"));
    });
    console.log(displayA());
})();
