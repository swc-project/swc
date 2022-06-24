(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("../foo"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "../foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.foo);
})(this, function(_foo, _foo1) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    _foo1 = _interopRequireDefault(_foo1);
    _foo.default, _foo1.default;
});
