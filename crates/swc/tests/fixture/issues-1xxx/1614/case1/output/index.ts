"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async ()=>{
    const example = await Promise.resolve("./example").then((p)=>_interopRequireWildcard(require(p)));
    console.log(example.foo);
})();
