(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo);
})(this, function(_foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Foo", {
        get: ()=>_foo.Foo,
        enumerable: true
    });
    _foo = _interopRequireWildcard(_foo);
});
