(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./Z"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./Z"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.z);
})(this, function(exports, _Z) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "X", {
        enumerable: true,
        get: function() {
            return _Z.default;
        }
    });
    _Z = /*#__PURE__*/ _interop_require_default(_export_star(_Z, exports));
});
