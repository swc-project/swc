(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("bar"));
    else if (typeof define === "function" && define.amd) define([
        "bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.bar);
})(this, function(_bar) {
    "use strict";
    import(`world/${(0, _bar.foo)(baz)}.js`);
});
