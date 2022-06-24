(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("white"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "white"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.white);
})(this, function(_white) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>_white.default,
        enumerable: true
    });
    _white = _interopRequireDefault(_white);
});
