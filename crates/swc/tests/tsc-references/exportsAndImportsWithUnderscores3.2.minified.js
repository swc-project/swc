//// [exportsAndImportsWithUnderscores3.ts]
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
    ___: 30,
    ___hello: 21,
    _hi: 40
};
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("./m1"));
_m1.default.___, _m1.default.___hello, _m1.default._hi;
