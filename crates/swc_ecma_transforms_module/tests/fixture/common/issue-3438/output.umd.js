(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.bar);
})(this, function(exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    import(`world/${(0, _bar.foo)(baz)}.js`);
});
