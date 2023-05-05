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
        get: function() {
            return _default;
        }
    });
    const _default = "./foo";
});
//// [index.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _async_to_generator._(function*() {
            return yield new Promise((resolve, reject)=>require([
                    (yield new Promise((resolve, reject)=>require([
                            "./foo"
                        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject))).default
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        });
        return _foo.apply(this, arguments);
    }
});
