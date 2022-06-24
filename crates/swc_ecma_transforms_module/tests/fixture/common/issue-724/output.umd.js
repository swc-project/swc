(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("mongodb"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "mongodb"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.mongodb);
})(this, function(_mongodb) {
    "use strict";
    require("foo");
});
