//// [defaultPath.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: function() {
        return C;
    }
});
class C {
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
var p1 = Promise.resolve(ValidSomeCondition() ? "./0" : "externalModule").then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
var p11 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
p1.then((zero)=>{
    return zero.foo(); // ok, zero is any
});
let j;
var p3 = Promise.resolve(j = getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
function* loadModule(directories) {
    for (const directory1 of directories){
        const path = `${directory1}\\moduleFile`;
        Promise.resolve((yield path)).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
    }
}
