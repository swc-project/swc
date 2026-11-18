(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory(require("foo"));
    else if (typeof define === "function" && define.amd) define([
        "foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) global.input = factory(global.foo);
})(this, function(foo) {
    "use strict";
    foo.bar = 1;
    foo.bar = 2;
    return foo;
});
