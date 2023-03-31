"use strict";
(async ()=>{
    const example = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./example")));
    console.log(example.foo);
})();
