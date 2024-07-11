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
    _assert = /*#__PURE__*/ _interop_require_default(_assert);
    const assert = require("assert");
    assert(true);
    (0, _assert.default)(true);
});
