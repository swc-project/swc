(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./foo"), require("./bar"), require("./derp"), require("./qux"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./foo",
        "./bar",
        "./derp",
        "./qux"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.bar, global.derp, global.qux);
})(this, function(exports, _foo, _bar, _derp, _qux) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _bar = /*#__PURE__*/ _interopRequireDefault(_bar);
});
