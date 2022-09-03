//// [defaultPath.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C", {
    enumerable: !0,
    get: ()=>C
});
class C {
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>_interopRequireWildcard(require(p))), Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
var p1 = Promise.resolve(ValidSomeCondition() ? "./0" : "externalModule").then((p)=>_interopRequireWildcard(require(p))), p1 = Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p))), p11 = Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>_interopRequireWildcard(require(p)));
p1.then((zero)=>zero.foo());
let j;
var p3 = Promise.resolve(j = getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
function* loadModule(directories) {
    for (let directory1 of directories){
        let path = `${directory1}\\moduleFile`;
        Promise.resolve((yield path)).then((p)=>_interopRequireWildcard(require(p)));
    }
}
