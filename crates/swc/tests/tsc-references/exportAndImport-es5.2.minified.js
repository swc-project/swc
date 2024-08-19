//// [exportAndImport-es5.ts]
//// [m1.ts]
function f1() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return f1;
    }
});
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return f2;
    }
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("./m1"));
function f2() {
    (0, _m1.default)();
}
