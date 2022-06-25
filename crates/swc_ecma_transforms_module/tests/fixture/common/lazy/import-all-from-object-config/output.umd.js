(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("./local"), require("external"));
    else if (typeof define === "function" && define.amd) define([
        "./local",
        "external"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.local, global.external);
})(this, function(_local, _external) {
    "use strict";
    function use() {
        (0, _local.local)(_external.external);
    }
});
