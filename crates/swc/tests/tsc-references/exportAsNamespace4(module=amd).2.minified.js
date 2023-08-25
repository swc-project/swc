//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
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
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./0"
], function(require, exports, _interop_require_wildcard, _0) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return _0;
        }
    }), _0 = /*#__PURE__*/ _interop_require_wildcard._(_0);
});
//// [11.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./0"
], function(require, exports, _interop_require_wildcard, _0) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return _default;
        }
    });
    var _default = _0 = /*#__PURE__*/ _interop_require_wildcard._(_0);
});
//// [2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_default",
    "./1",
    "./11"
], function(require, exports, _interop_require_default, _1, _11) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _1 = /*#__PURE__*/ _interop_require_default._(_1), _11 = /*#__PURE__*/ _interop_require_default._(_11), _1.default.a, _11.default.a, _1.default.b, _11.default.b;
});
