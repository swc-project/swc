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
], function(require, exports, _asyncToGenerator, _interopRequireWildcard, _tsGenerator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _asyncToGenerator = _asyncToGenerator.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    _tsGenerator = _tsGenerator.default;
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _asyncToGenerator(function() {
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            new Promise(function(resolve, reject) {
                                return require([
                                    "./foo"
                                ], function(m) {
                                    return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
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
                                    return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
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
