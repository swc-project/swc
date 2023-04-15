//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: function() {
        return foo;
    }
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
    get: function() {
        return p2;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
var p1 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
p1.then((zero)=>{
    return zero.foo();
});
var p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
function foo() {
    const p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
}
