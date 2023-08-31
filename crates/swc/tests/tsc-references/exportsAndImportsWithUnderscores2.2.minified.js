//// [exportsAndImportsWithUnderscores2.ts]
//// [m1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
var _default = {
    __esmodule: !0,
    __proto__: {}
};
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("./m1"));
_m1.default.__esmodule, _m1.default.__proto__;
