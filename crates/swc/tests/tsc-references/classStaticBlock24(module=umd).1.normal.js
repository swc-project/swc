//// [classStaticBlock24.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_class_call_check.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.classStaticBlock24Ts = {}, global.classCallCheckMjs);
})(this, function(exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "C", {
        enumerable: true,
        get: function() {
            return C;
        }
    });
    _classCallCheck = _classCallCheck.default;
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    var __ = {
        writable: true,
        value: function() {
            C.x = 1;
        }()
    };
});
