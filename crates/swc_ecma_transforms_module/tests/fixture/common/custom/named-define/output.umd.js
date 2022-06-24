(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("src"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "src"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.src);
})(this, function(_src) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        get: ()=>_src.foo,
        enumerable: true
    });
});
