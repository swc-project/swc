//// [importCallExpressionCheckReturntype1.ts]
//// [anotherModule.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "D", {
    enumerable: !0,
    get: function() {
        return D;
    }
});
class D {
}
//// [defaultPath.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C", {
    enumerable: !0,
    get: function() {
        return C;
    }
});
class C {
}
//// [1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./defaultPath"))), Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./defaultPath"))), Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./defaultPath")));
