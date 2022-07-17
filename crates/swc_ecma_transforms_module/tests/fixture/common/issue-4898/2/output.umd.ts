(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("assert"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "assert"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.assert);
})(this, function(exports, _assert) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const _assert1 = /*#__PURE__*/ _interopRequireDefault(_assert);
    _assert(true);
    (0, _assert1.default)(true);
});
