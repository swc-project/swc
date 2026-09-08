(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("bar"), require("baz"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "bar",
        "baz"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar, global.baz);
})(this, function(exports, _bar, _bar1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _bar = /*#__PURE__*/ _interop_require_default(_bar);
    (0, _bar.default)();
    _bar1();
});
