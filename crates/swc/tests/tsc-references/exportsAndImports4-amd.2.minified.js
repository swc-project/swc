//// [exportsAndImports4-amd.ts]
define([
    "require"
], function(require) {});
//// [t1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return _default;
        }
    });
    var _default = "hello";
});
//// [t2.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./t1"
], function(require, exports, _interop_require_wildcard, _t1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var _t11 = /*#__PURE__*/ _interop_require_wildcard._(_t1);
    _t1.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default;
});
//// [t3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./t1"
], function(require, exports, _interop_require_wildcard, _t1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        a: function() {
            return _t1;
        },
        b: function() {
            return _t11.default;
        },
        c: function() {
            return _t11;
        },
        d: function() {
            return _t11.default;
        },
        e1: function() {
            return _t11.default;
        },
        e2: function() {
            return _t11;
        },
        f1: function() {
            return _t11.default;
        },
        f2: function() {
            return _t11.default;
        }
    });
    var _t11 = /*#__PURE__*/ _interop_require_wildcard._(_t1);
    _t1.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default;
});
