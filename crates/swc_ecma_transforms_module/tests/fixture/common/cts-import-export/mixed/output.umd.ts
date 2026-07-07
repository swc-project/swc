(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("foo"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.foo);
})(this, function(exports, _foo, bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    (0, _foo.default)();
    bar();
});
