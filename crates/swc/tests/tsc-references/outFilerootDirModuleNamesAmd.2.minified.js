//// [src/a.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_default.mjs",
    "./b"
], function(require, exports, _interopRequireDefault, _b) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>Foo
    }), _b = (_interopRequireDefault = _interopRequireDefault.default)(_b);
    class Foo {
    }
    (0, _b.default)();
});
//// [src/b.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_default.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "./a"
], function(require, exports, _interopRequireDefault, _interopRequireWildcard, _a) {
    "use strict";
    function foo() {
        new _a.default();
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>foo
    }), _interopRequireDefault = _interopRequireDefault.default, _interopRequireWildcard = _interopRequireWildcard.default, _a = _interopRequireDefault(_a), new Promise((resolve, reject)=>require([
            "./a"
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
