(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("external"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "external"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.external);
})(this, function(exports, _external) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "named1", {
        get: ()=>_external.named1,
        enumerable: true
    });
});
