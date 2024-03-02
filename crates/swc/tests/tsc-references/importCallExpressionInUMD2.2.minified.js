//// [0.ts]
var global, factory;
global = this, factory = function(exports1) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "B", {
        enumerable: !0,
        get: function() {
            return B;
        }
    });
    class B {
        print() {
            return "I am B";
        }
    }
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
//// [2.ts]
var global, factory;
global = this, factory = function(exports1, _interop_require_wildcard) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), function(x) {
        x.then((value)=>{
            new value.B().print();
        });
    }(import("./0"));
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireWildcard);
