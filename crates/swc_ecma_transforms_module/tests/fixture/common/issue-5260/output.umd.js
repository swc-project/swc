(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("a"), require("b"), require("c"), require("d"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "a",
        "b",
        "c",
        "d"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.a, global.b, global.c, global.d);
})(this, function(exports, _a, _b, _c, _d) {
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
        Aa: ()=>_a.A,
        Ab: ()=>_b.A,
        C: ()=>_c.default,
        D: ()=>_d.default
    });
    _c = /*#__PURE__*/ _interopRequireDefault(_c);
    _d = /*#__PURE__*/ _interopRequireDefault(_d);
});
