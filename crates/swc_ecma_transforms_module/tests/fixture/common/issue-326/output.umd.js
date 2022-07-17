(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("../foo"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "../foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.foo);
})(this, function(exports, _foo, _foo1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interopRequireDefault(_foo);
    _foo1 = /*#__PURE__*/ _interopRequireDefault(_foo1);
    _foo.default, _foo1.default;
});
