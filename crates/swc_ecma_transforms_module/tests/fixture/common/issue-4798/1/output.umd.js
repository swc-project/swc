(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("vs/base/test/node/testUtils"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "vs/base/test/node/testUtils"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.testUtils);
})(this, function(exports, _testUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const fixturesFolder = (0, _testUtils.getPathFromAmdModule)(require, "./fixtures");
});
