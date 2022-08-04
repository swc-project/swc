(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.bar);
})(this, function(exports, _foo, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interopRequireDefault(_foo);
    (0, _foo.default)("foo");
    (0, _foo.default)`foo`;
    (0, _bar.bar)("bar");
    (0, _bar.bar)`bar`;
});
