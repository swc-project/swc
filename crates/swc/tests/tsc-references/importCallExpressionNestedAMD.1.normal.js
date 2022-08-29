//// [foo.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>_default
    });
    const _default = "./foo";
});
//// [index.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _asyncToGenerator, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _asyncToGenerator = _asyncToGenerator.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _asyncToGenerator(function*() {
            return yield new Promise((resolve, reject)=>require([
                    (yield new Promise((resolve, reject)=>require([
                            "./foo"
                        ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject))).default
                ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
        });
        return _foo.apply(this, arguments);
    }
});
