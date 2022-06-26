(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./bar/foo"), require("./baz/foo"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./bar/foo",
        "./baz/foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.foo);
})(this, function(exports, _foo, _foo1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = _interopRequireDefault(_foo);
    _foo1 = _interopRequireDefault(_foo1);
    const a = [
        _foo1.default,
        _foo.default
    ];
});
