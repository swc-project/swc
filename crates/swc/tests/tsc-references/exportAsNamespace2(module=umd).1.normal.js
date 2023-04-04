//// [0.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.0Ts = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        a: function() {
            return a;
        },
        b: function() {
            return b;
        }
    });
    var a = 1;
    var b = 2;
});
//// [1.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_interop_require_wildcard"), require("./0"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_interop_require_wildcard",
        "./0"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.1Ts = {}, global.interopRequireWildcard, global["0"]);
})(this, function(exports, _interop_require_wildcard, _0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "ns", {
        enumerable: true,
        get: function() {
            return _0;
        }
    });
    _0 = /*#__PURE__*/ _interop_require_wildcard._(_0);
    ns.a;
    ns.b;
});
//// [2.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_interop_require_wildcard"), require("./1"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_interop_require_wildcard",
        "./1"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.2Ts = {}, global.interopRequireWildcard, global["1"]);
})(this, function(exports, _interop_require_wildcard, _1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _1 = /*#__PURE__*/ _interop_require_wildcard._(_1);
    _1.ns.a;
    _1.ns.b;
});
