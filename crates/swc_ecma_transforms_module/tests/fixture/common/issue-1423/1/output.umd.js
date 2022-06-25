(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("necessary"));
    else if (typeof define === "function" && define.amd) define([
        "necessary"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.necessary);
})(this, function(_necessary) {
    "use strict";
    const { second  } = _necessary.arrayUtilities;
    const elements = [
        1,
        2,
        3
    ], secondElement = second(elements);
    console.log(secondElement);
});
