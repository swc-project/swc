(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("mongodb"));
    else if (typeof define === "function" && define.amd) define([
        "mongodb"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.mongodb);
})(this, function(_mongodb) {
    "use strict";
    require("foo");
});
