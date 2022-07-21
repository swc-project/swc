(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("a"), require("b"), require("c"), require("d"), require("e"), require("f"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.a, global.b, global.c, global.d, global.e, global.f);
})(this, function(exports, _a, _b, _c, _d, _e, _f) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        a: ()=>_a.X,
        b: ()=>_b.X,
        c: ()=>_c.default,
        d: ()=>_d.default,
        e: ()=>_e,
        f: ()=>_f
    });
    _c = /*#__PURE__*/ _interopRequireDefault(_c);
    _d = /*#__PURE__*/ _interopRequireDefault(_d);
    _e = /*#__PURE__*/ _interopRequireWildcard(_e);
    _f = /*#__PURE__*/ _interopRequireWildcard(_f);
    // unresolved
    const x = X;
    const _a1 = a;
    const _c1 = c;
    const _e1 = e;
    // top level
    const b = 1, d = 2, f = 3;
    console.log(b, d, f);
});
