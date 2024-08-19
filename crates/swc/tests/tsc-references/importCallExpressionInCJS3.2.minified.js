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
!function(x) {
    x.then((value)=>{
        new value.B().print();
    });
}(Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))));
