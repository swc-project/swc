(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("vs/base/test/common/testUtils"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "vs/base/test/common/testUtils"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.testUtils);
})(this, function(exports, _test_utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "flakySuite", {
        enumerable: true,
        get: ()=>flakySuite
    });
    _test_utils = /*#__PURE__*/ _interop_require_wildcard(_test_utils);
    var flakySuite = _test_utils.flakySuite;
});
