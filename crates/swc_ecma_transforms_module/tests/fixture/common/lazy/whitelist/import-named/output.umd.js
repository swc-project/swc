(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("white"), require("black"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "white",
        "black"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.white, global.black);
})(this, function(exports, _white, _black) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function use1() {
        console.log(_white.foo1);
    }
    function use2() {
        console.log(_black.foo2);
    }
});
