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
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return _0;
        }
    }), _0 = (_interopRequireWildcard = _interopRequireWildcard.default)(_0);
});
//// [11.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_interop_require_wildcard.mjs"), require("./0")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_interop_require_wildcard.mjs",
        "./0"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.11Ts = {}, global.interopRequireWildcardMjs, global["0"]);
}(this, function(exports, _interopRequireWildcard, _0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return _default;
        }
    });
    var _default = _0 = (_interopRequireWildcard = _interopRequireWildcard.default)(_0);
});
//// [2.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_interop_require_default.mjs"), require("./1"), require("./11")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_interop_require_default.mjs",
        "./1",
        "./11"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.2Ts = {}, global.interopRequireDefaultMjs, global["1"], global["11"]);
}(this, function(exports, _interopRequireDefault, _1, _11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _1 = (_interopRequireDefault = _interopRequireDefault.default)(_1), _11 = _interopRequireDefault(_11), _1.default.a, _11.default.a, _1.default.b, _11.default.b;
});
