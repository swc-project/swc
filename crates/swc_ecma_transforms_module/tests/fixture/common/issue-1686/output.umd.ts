(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("a"), require("b"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "a",
        "b"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.a, global.b);
})(this, function(exports, _a, _b) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    console.log(1);
});
 // print b
