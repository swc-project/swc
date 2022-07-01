(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./St"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./St"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.st);
})(this, function(exports, _st) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "createP", {
        enumerable: true,
        get: ()=>_st.createP
    });
});
