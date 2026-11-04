(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_interop_require_wildcard"), require("./inner/b/index.mjs"), require("../packages/c/src/index.mjs"), require("lodash"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_interop_require_wildcard",
        "./inner/b/index.mjs",
        "../packages/c/src/index.mjs",
        "lodash"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.index = {}, global.interopRequireWildcard, global.indexMjs, global.indexMjs, global.lodash);
})(this, function(exports, _interop_require_wildcard, _b, _c, _lodash) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    async function display() {
        const displayA = await import('./inner/a').then((c)=>c.displayA);
        console.log(displayA());
        console.log((0, _b.displayB)());
        console.log((0, _c.displayC)());
        const foo = (0, _lodash.merge)({}, {
            a: 22
        });
    }
    display();
});
