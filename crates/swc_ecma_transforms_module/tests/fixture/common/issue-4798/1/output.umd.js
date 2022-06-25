(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("vs/base/test/node/testUtils"));
    else if (typeof define === "function" && define.amd) define([
        "vs/base/test/node/testUtils"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.testUtils);
})(this, function(_testUtils) {
    "use strict";
    const fixturesFolder = (0, _testUtils.getPathFromAmdModule)(require, "./fixtures");
});
