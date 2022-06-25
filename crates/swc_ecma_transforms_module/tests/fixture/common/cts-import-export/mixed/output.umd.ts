(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("foo"));
    else if (typeof define === "function" && define.amd) define([
        "foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.foo);
})(this, function(_foo) {
    "use strict";
    const _foo1 = _interopRequireDefault(_foo);
    (0, _foo1.default)();
    _foo();
});
