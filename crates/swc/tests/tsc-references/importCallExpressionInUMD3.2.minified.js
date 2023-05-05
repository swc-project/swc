//// [0.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports) : "function" == typeof define && define.amd ? define([
        "exports"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.0Ts = {});
}(this, function(exports1) {
    "use strict";
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
});
//// [2.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_interop_require_wildcard")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/_/_interop_require_wildcard"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireWildcard);
}(this, function(exports1, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), async function() {
        class C extends (await import("./0")).B {
        }
        new C().print();
    }();
});
