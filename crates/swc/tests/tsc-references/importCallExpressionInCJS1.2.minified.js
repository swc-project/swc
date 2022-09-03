//// [0.ts]
"use strict";
function foo() {
    return "foo";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: ()=>foo
});
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "p2", {
    enumerable: !0,
    get: ()=>p2
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
var p1 = Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
p1.then((zero)=>zero.foo());
var p2 = Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
function foo() {
    Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
}
