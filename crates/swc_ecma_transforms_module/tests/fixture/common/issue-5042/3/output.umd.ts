(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("vs/base/test/common/testUtils"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "vs/base/test/common/testUtils"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.testUtils);
})(this, function(exports, _testUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "flakySuite", {
        enumerable: true,
        get: ()=>flakySuite
    });
    _testUtils = /*#__PURE__*/ _interopRequireWildcard(_testUtils);
    var flakySuite = _testUtils.flakySuite;
});
