(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./local"), require("external_test"), require("test"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./local",
        "external_test",
        "test"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.local, global.externalTest, global.test);
})(this, function(exports, _local, _externalTest, _test) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function use() {
        (0, _local.local)((0, _externalTest.external)(_test.test));
    }
});
