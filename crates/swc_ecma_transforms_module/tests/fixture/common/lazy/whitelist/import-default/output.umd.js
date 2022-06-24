(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("white"), require("black"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "white",
        "black"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.white, global.black);
})(this, function(_white, _black) {
    "use strict";
    _white = _interopRequireDefault(_white);
    _black = _interopRequireDefault(_black);
    console.log(_white.default);
    console.log(_black.default);
});
