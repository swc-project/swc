//// [0.ts]
function foo() {
    return "foo";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: function() {
        return foo;
    }
});
//// [1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "p2", {
    enumerable: !0,
    get: function() {
        return p2;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))), Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))).then((zero)=>zero.foo());
var p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
