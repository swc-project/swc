define([
    "require"
], function(require) {
    "use strict";
    (async ()=>{
        const example = await new Promise((resolve, reject)=>require([
                "./example"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
        console.log(example.foo);
    })();
});
