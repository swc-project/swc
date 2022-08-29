//// [classStaticBlock24.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_class_call_check.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.classStaticBlock24Ts = {}, global.classCallCheckMjs);
}(this, function(exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "C", {
        enumerable: !0,
        get: function() {
            return C;
        }
    }), _classCallCheck = _classCallCheck.default;
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    C.x = 1;
});
