//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: function() {
            return foo;
        }
    });
    function foo() {
        return "foo";
    }
});
//// [1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _classCallCheck, _interopRequireWildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        p2: function() {
            return p2;
        },
        D: function() {
            return D;
        }
    });
    _classCallCheck = _classCallCheck.default;
    _interopRequireWildcard = _interopRequireWildcard.default;
    new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
        }, reject);
    });
    var p1 = new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
        }, reject);
    });
    p1.then(function(zero) {
        return zero.foo();
    });
    var p2 = new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
        }, reject);
    });
    function foo() {
        var p2 = new Promise(function(resolve, reject) {
            return require([
                "./0"
            ], function(m) {
                return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
            }, reject);
        });
    }
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _classCallCheck(this, C);
        }
        var _proto = C.prototype;
        _proto.method = function method() {
            var loadAsync = new Promise(function(resolve, reject) {
                return require([
                    "./0"
                ], function(m) {
                    return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
                }, reject);
            });
        };
        return C;
    }();
    var D = /*#__PURE__*/ function() {
        "use strict";
        function D() {
            _classCallCheck(this, D);
        }
        var _proto = D.prototype;
        _proto.method = function method() {
            var loadAsync = new Promise(function(resolve, reject) {
                return require([
                    "./0"
                ], function(m) {
                    return resolve(/*#__PURE__*/ _interopRequireWildcard(m));
                }, reject);
            });
        };
        return D;
    }();
});
