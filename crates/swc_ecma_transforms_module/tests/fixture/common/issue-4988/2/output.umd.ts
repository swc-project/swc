(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("vs/base/test/common/testUtils"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "vs/base/test/common/testUtils"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.testUtils);
})(this, function(_testUtils) {
    "use strict";
    _testUtils = _interopRequireWildcard(_testUtils);
});
