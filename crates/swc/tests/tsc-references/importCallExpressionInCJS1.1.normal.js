//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: ()=>foo
});
function foo() {
    return "foo";
}
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "p2", {
    enumerable: true,
    get: ()=>p2
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
var p1 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
p1.then((zero)=>{
    return zero.foo();
});
var p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
function foo() {
    const p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./0")));
}
