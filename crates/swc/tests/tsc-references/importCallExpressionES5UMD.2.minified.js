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
global = this, factory = function(exports1, _class_call_check, _interop_require_wildcard) {
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    });
    var all = {
        get D () {
            return D;
        },
        get p2 () {
            return p2;
        }
    };
    for(var name in all)Object.defineProperty(exports1, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    import("./0"), import("./0").then(function(zero) {
        return zero.foo();
    });
    var p2 = import("./0"), D = /*#__PURE__*/ function() {
        function D() {
            _class_call_check._(this, D);
        }
        return D.prototype.method = function() {
            import("./0");
        }, D;
    }();
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_class_call_check"), require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_interop_require_wildcard"
], factory) : (global = "u" > typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {}, global.classCallCheck, global.interopRequireWildcard);
