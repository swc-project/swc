(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("c"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "c"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.c);
})(this, function(exports, _c) {
    "use strict";
    _export_star(_c, exports);
});
