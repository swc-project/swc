//// [classStaticBlock24.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_class_call_check.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.classStaticBlock24Ts = {}, global.classCallCheckMjs);
}(this, function(exports1, _class_call_check) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "C", {
        enumerable: !0,
        get: function() {
            return C;
        }
    }), _class_call_check = _class_call_check.default;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    C.x = 1;
});
