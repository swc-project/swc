"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
(async ()=>{
    const example = await Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./example")));
    console.log(example.foo);
})();
