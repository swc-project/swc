define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    (async ()=>{
        const example = await new Promise((resolve, reject)=>require([
                "./example"
            ], (m)=>resolve(_interopRequireWildcard(m)), reject));
        console.log(example.foo);
    })();
});
