(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("necessary"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "necessary"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.necessary);
})(this, function(exports, _necessary) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const { second  } = _necessary.arrayUtilities;
    const elements = [
        1,
        2,
        3
    ], secondElement = second(elements);
    console.log(secondElement);
});
