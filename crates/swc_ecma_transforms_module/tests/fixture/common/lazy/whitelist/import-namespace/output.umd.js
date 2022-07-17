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
    _white = /*#__PURE__*/ _interopRequireWildcard(_white);
    _black = /*#__PURE__*/ _interopRequireWildcard(_black);
    function use1() {
        console.log(_white);
    }
    function use2() {
        console.log(_black);
    }
});
