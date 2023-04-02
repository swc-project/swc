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
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>_interop_require_wildcard(require(p))), Promise.resolve(getSpecifier()).then((p)=>_interop_require_wildcard(require(p)));
var p1 = (Promise.resolve(ValidSomeCondition() ? "./0" : "externalModule").then((p)=>_interop_require_wildcard(require(p))), Promise.resolve(getSpecifier()).then((p)=>_interop_require_wildcard(require(p))));
Promise.resolve(getSpecifier()).then((p)=>_interop_require_wildcard(require(p))), Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>_interop_require_wildcard(require(p))), p1.then((zero)=>zero.foo()), Promise.resolve(getSpecifier()).then((p)=>_interop_require_wildcard(require(p)));
