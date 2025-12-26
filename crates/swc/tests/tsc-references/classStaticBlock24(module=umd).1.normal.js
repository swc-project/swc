//// [classStaticBlock24.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_class_call_check"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_class_call_check"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.classStaticBlock24Ts = {}, global.classCallCheck);
})(this, function(exports, _class_call_check) {
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
    var __ = new WeakMap();
    var C = function C() {
        "use strict";
        _class_call_check._(this, C);
    };
    __.set(C, {
        writable: true,
        value: C.x = 1
    });
});
