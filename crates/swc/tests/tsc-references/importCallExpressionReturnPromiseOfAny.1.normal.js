//// [defaultPath.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: ()=>C
});
class C {
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p1 = Promise.resolve(ValidSomeCondition() ? "./0" : "externalModule").then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p11 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
p1.then((zero)=>{
    return zero.foo(); // ok, zero is any
});
let j;
var p3 = Promise.resolve(j = getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
function* loadModule(directories) {
    for (const directory1 of directories){
        const path = `${directory1}\\moduleFile`;
        Promise.resolve((yield path)).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
    }
}
