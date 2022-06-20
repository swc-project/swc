"use strict";
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
(async ()=>{
    const example = await Promise.resolve("./example").then(function(p) {
        return _interop_require_wildcard(require(p));
    });
    console.log(example.foo);
})();
