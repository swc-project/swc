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
    });
    var all = {
        get a () {
            return _t1;
        },
        get b () {
            return _t11.default;
        },
        get c () {
            return _t11;
        },
        get d () {
            return _t11.default;
        },
        get e1 () {
            return _t11.default;
        },
        get e2 () {
            return _t11;
        },
        get f1 () {
            return _t11.default;
        },
        get f2 () {
            return _t11.default;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    var _t11 = /*#__PURE__*/ _interop_require_wildcard._(_t1);
    _t1.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default, _t11.default;
});
