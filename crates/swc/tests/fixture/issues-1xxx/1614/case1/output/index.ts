"use strict";
const _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async ()=>{
    const example = await Promise.resolve("./example").then((p)=>_interopRequireWildcardMjs(require(p)));
    console.log(example.foo);
})();
