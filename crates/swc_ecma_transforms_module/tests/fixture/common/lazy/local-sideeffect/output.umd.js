(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("./a"));
    else if (typeof define === "function" && define.amd) define([
        "./a"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.a);
})(this, function(_a) {
    "use strict";
});
