(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory(require("foo"));
    else if (typeof define === "function" && define.amd) define([
        "foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) module.exports = factory(global.foo);
})(this, function(_foo) {
    "use strict";
    _foo.bar = 1;
    _foo.bar = 2;
    return _foo;
});
