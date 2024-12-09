"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _b = require("./inner/b/index.mjs");
const _c = require("../packages/c/src/index.mjs");
const _lodash = require("lodash");
async function display() {
    const displayA = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./inner/a/index.mjs"))).then((c)=>c.displayA);
    console.log(displayA());
    console.log((0, _b.displayB)());
    console.log((0, _c.displayC)());
    const foo = (0, _lodash.merge)({}, {
        a: 22
    });
}
display();
