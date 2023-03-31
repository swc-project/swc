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
    var _default = "./foo";
});
//// [index.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "@swc/helpers/src/_ts_generator.mjs"
], function(require, exports, _async_to_generator, _interop_require_wildcard, _ts_generator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _async_to_generator = _async_to_generator.default;
    _interop_require_wildcard = _interop_require_wildcard.default;
    _ts_generator = _ts_generator.default;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            new Promise(function(resolve, reject) {
                                return require([
                                    "./foo"
                                ], function(m) {
                                    return resolve(/*#__PURE__*/ _interop_require_wildcard(m));
                                }, reject);
                            })
                        ];
                    case 1:
                        return [
                            4,
                            new Promise(function(resolve, reject) {
                                return require([
                                    _state.sent().default
                                ], function(m) {
                                    return resolve(/*#__PURE__*/ _interop_require_wildcard(m));
                                }, reject);
                            })
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        });
        return _foo.apply(this, arguments);
    }
});
