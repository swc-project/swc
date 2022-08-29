//// [src/a.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_default.mjs",
    "./b"
], function(require, exports, _interopRequireDefault, _b) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>Foo
    });
    _interopRequireDefault = _interopRequireDefault.default;
    _b = /*#__PURE__*/ _interopRequireDefault(_b);
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>foo
    });
    _interopRequireDefault = _interopRequireDefault.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    _a = /*#__PURE__*/ _interopRequireDefault(_a);
    function foo() {
        new _a.default();
    }
    // https://github.com/microsoft/TypeScript/issues/37429
    new Promise((resolve, reject)=>require([
            "./a"
        ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
});
