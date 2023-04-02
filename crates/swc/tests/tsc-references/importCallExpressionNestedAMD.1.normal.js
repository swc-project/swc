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
], function(require, exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _async_to_generator = _async_to_generator.default;
    _interop_require_wildcard = _interop_require_wildcard.default;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _async_to_generator(function*() {
            return yield new Promise((resolve, reject)=>require([
                    (yield new Promise((resolve, reject)=>require([
                            "./foo"
                        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject))).default
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
        });
        return _foo.apply(this, arguments);
    }
});
