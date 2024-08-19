//// [src/a.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_default",
    "./b"
], function(require, exports, _interop_require_default, _b) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return Foo;
        }
    }), _b = /*#__PURE__*/ _interop_require_default._(_b);
    class Foo {
    }
    (0, _b.default)();
});
//// [src/b.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_default",
    "@swc/helpers/_/_interop_require_wildcard",
    "./a"
], function(require, exports, _interop_require_default, _interop_require_wildcard, _a) {
    function foo() {
        new _a.default();
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return foo;
        }
    }), _a = /*#__PURE__*/ _interop_require_default._(_a), new Promise((resolve, reject)=>require([
            "./a"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
});
