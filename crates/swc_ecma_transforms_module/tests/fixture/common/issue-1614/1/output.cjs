"use strict";
(async ()=>{
    const example = await Promise.resolve().then(()=>_interopRequireWildcard(require("./example")));
    console.log(example.foo);
})();
