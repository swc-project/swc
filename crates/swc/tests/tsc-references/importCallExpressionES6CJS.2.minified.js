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
});
var target = exports, all = {
    get D () {
        return D;
    },
    get p2 () {
        return p2;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))), Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))).then((zero)=>zero.foo());
var p2 = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
class D {
    method() {
        Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
    }
}
