(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("assert"));
    else if (typeof define === "function" && define.amd) define([
        "assert"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.assert);
})(this, function(_assert) {
    "use strict";
    _assert(true);
});
