//// [0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "B", {
    enumerable: !0,
    get: function() {
        return B;
    }
});
class B {
    print() {
        return "I am B";
    }
}
//// [2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
!async function() {
    class C extends (await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")))).B {
    }
    new C().print();
}();
