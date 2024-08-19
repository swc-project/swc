//// [0.ts]
var global, factory;
global = this, factory = function(exports1) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports1, {
        a: function() {
            return a;
        },
        b: function() {
            return b;
        }
    });
    var a = 1, b = 2;
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
//// [1.ts]
var global, factory;
global = this, factory = function(exports1, _interop_require_wildcard, _0) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), Object.defineProperty(exports1, "ns", {
        enumerable: !0,
        get: function() {
            return _0;
        }
    }), _0 = /*#__PURE__*/ _interop_require_wildcard._(_0), ns.a, ns.b;
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_interop_require_wildcard"), require("./0")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./0"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {}, global.interopRequireWildcard, global["0"]);
//// [2.ts]
var global, factory;
global = this, factory = function(exports1, _interop_require_wildcard, _1) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), (_1 = /*#__PURE__*/ _interop_require_wildcard._(_1)).ns.a, _1.ns.b;
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_interop_require_wildcard"), require("./1")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./1"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireWildcard, global["1"]);
