(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("white"), require("black"));
    else if (typeof define === "function" && define.amd) define([
        "white",
        "black"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.white, global.black);
})(this, function(_white, _black) {
    "use strict";
    function use1() {
        console.log(_white.foo1);
    }
    function use2() {
        console.log(_black.foo2);
    }
});
