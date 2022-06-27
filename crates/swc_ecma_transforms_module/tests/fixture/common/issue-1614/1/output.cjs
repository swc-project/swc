"use strict";
(async ()=>{
    const example = await Promise.resolve("./example").then((p)=>_interopRequireWildcard(require(p)));
    console.log(example.foo);
})();
