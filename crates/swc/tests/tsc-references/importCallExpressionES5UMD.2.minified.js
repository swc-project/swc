//// [0.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
}(this, function(exports) {
    "use strict";
    function foo() {
        return "foo";
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "foo", {
        enumerable: !0,
        get: function() {
            return foo;
        }
    });
});
//// [1.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_class_call_check.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {}, global.classCallCheckMjs, global.interopRequireWildcardMjs);
}(this, function(exports, _classCallCheck, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        p2: function() {
            return p2;
        },
        D: function() {
            return D;
        }
    }), _classCallCheck = _classCallCheck.default, _interopRequireWildcard = _interopRequireWildcard.default, import("./0"), import("./0").then(function(zero) {
        return zero.foo();
    });
    var p2 = import("./0"), D = function() {
        "use strict";
        function D() {
            _classCallCheck(this, D);
        }
        return D.prototype.method = function() {
            import("./0");
        }, D;
    }();
});
