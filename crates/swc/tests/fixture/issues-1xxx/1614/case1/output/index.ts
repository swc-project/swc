"use strict";
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
(async ()=>{
    const example = await Promise.resolve("./example").then(function(p) {
        return (0, _interopRequireWildcardMjs.default)(require(p));
    });
    console.log(example.foo);
})();
