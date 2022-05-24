"use strict";
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async ()=>{
    const example = await Promise.resolve().then(function() {
        return _interop_require_wildcard(require("./example"));
    });
    console.log(example.foo);
})();
