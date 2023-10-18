//// [0.ts]
var global, factory;
global = this, factory = function(exports1) {
    function foo() {
        return "foo";
    }
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "foo", {
        enumerable: !0,
        get: function() {
            return foo;
        }
    });
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
//// [1.ts]
var global, factory;
global = this, factory = function(exports1, _interop_require_wildcard) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "p2", {
        enumerable: !0,
        get: function() {
            return p2;
        }
    }), import("./0"), import("./0").then((zero)=>zero.foo());
    var p2 = import("./0");
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {}, global.interopRequireWildcard);
