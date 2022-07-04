define([
    "require"
], function(require) {
    "use strict";
    (async ()=>{
        const example = await new Promise((resolve, reject)=>require([
                "./example"
            ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
        console.log(example.foo);
    })();
});
