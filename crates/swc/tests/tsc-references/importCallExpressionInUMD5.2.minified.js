//// [0.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
}(this, function(exports1) {
    "use strict";
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
});
//// [1.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/_/_async_to_generator",
        "@swc/helpers/_/_interop_require_wildcard"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.1Ts = {}, global.asyncToGenerator, global.interopRequireWildcard);
}(this, function(exports1, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    });
});
