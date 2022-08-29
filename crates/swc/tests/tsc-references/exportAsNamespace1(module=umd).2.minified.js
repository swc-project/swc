//// [0.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
}(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        a: function() {
            return a;
        },
        b: function() {
            return b;
        }
    });
    var a = 1, b = 2;
});
//// [1.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_interop_require_wildcard.mjs"), require("./0")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_interop_require_wildcard.mjs",
        "./0"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {}, global.interopRequireWildcardMjs, global["0"]);
}(this, function(exports, _interopRequireWildcard, _0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "ns", {
        enumerable: !0,
        get: function() {
            return _0;
        }
    }), _0 = (_interopRequireWildcard = _interopRequireWildcard.default)(_0), ns.a, ns.b;
});
//// [2.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_interop_require_wildcard.mjs"), require("./1")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_interop_require_wildcard.mjs",
        "./1"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireWildcardMjs, global["1"]);
}(this, function(exports, _interopRequireWildcard, _1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), (_1 = (_interopRequireWildcard = _interopRequireWildcard.default)(_1)).ns.a, _1.ns.b;
});
