(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("a"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "a"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.a);
})(this, function(exports, _a) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _a = /*#__PURE__*/ _interopRequireDefault(_a);
    _a.default.preview(...c);
});
