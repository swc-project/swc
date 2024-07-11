(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./foo"), require("./derp"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./foo",
        "./derp"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.derp);
})(this, function(exports, _foo, _derp) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
