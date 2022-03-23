"use strict";
var swcHelpers = require("@swc/helpers");
(async ()=>{
    const example = await Promise.resolve().then(function() {
        return swcHelpers.interopRequireWildcard(require("./example"));
    });
    console.log(example.foo);
})();
