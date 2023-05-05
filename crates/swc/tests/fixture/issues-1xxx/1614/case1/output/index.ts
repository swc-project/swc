"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
(async ()=>{
    const example = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./example")));
    console.log(example.foo);
})();
