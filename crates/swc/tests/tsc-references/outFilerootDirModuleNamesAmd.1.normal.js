//// [src/a.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_default.mjs",
    "./b"
], function(require, exports, _interop_require_default, _b) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>Foo
    });
    _interop_require_default = _interop_require_default.default;
    _b = /*#__PURE__*/ _interop_require_default(_b);
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
], function(require, exports, _interop_require_default, _interop_require_wildcard, _a) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>foo
    });
    _interop_require_default = _interop_require_default.default;
    _interop_require_wildcard = _interop_require_wildcard.default;
    _a = /*#__PURE__*/ _interop_require_default(_a);
    function foo() {
        new _a.default();
    }
    // https://github.com/microsoft/TypeScript/issues/37429
    new Promise((resolve, reject)=>require([
            "./a"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
});
