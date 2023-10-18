//// [classStaticBlock24.ts]
var global, factory;
global = this, factory = function(exports1, _class_call_check) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "C", {
        enumerable: !0,
        get: function() {
            return C;
        }
    });
    var C = function C() {
        _class_call_check._(this, C);
    };
    C.x = 1;
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_class_call_check")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_class_call_check"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.classStaticBlock24Ts = {}, global.classCallCheck);
