define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./inner/b/index.mjs",
    "../packages/c/src/index.mjs",
    "lodash"
], function(require, exports, _interop_require_wildcard, _b, _c, _lodash) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    async function display() {
        const displayA = await new Promise((resolve, reject)=>require([
                "./inner/a/index.mjs"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)).then((c)=>c.displayA);
        console.log(displayA());
        console.log((0, _b.displayB)());
        console.log((0, _c.displayC)());
        const foo = (0, _lodash.merge)({}, {
            a: 22
        });
    }
    display();
});
