(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("white"), require("black"));
    else if (typeof define === "function" && define.amd) define([
        "white",
        "black"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.white, global.black);
})(this, function(_white, _black) {
    "use strict";
    _white = _interopRequireWildcard(_white);
    _black = _interopRequireWildcard(_black);
    function use1() {
        console.log(_white);
    }
    function use2() {
        console.log(_black);
    }
});
