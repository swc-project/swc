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
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        X: function() {
            return _Z.default;
        },
        X2: function() {
            return _Z.X2;
        },
        Y: function() {
            return _Z.Y;
        }
    });
    _Z = /*#__PURE__*/ _interop_require_wildcard(_export_star(_Z, exports));
});
