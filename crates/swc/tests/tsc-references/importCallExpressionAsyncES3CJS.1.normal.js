//// [test.ts]
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
    fn: function() {
        return fn;
    },
    cl1: function() {
        return cl1;
    },
    obj: function() {
        return obj;
    },
    cl2: function() {
        return cl2;
    },
    l: function() {
        return l;
    }
});
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _asyncToGenerator(function() {
        var req;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interopRequireWildcard(require("./test"));
                        }) // ONE
                    ];
                case 1:
                    req = _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _fn.apply(this, arguments);
}
var cl1 = /*#__PURE__*/ function() {
    "use strict";
    function cl1() {
        _classCallCheck(this, cl1);
    }
    var _proto = cl1.prototype;
    _proto.m = function m() {
        return _asyncToGenerator(function() {
            var req;
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return /*#__PURE__*/ _interopRequireWildcard(require("./test"));
                            }) // TWO
                        ];
                    case 1:
                        req = _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return cl1;
}();
var obj = {
    m: /*#__PURE__*/ _asyncToGenerator(function() {
        var req;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interopRequireWildcard(require("./test"));
                        }) // THREE
                    ];
                case 1:
                    req = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })
};
var cl2 = function cl2() {
    "use strict";
    _classCallCheck(this, cl2);
    this.p = {
        m: /*#__PURE__*/ _asyncToGenerator(function() {
            var req;
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return /*#__PURE__*/ _interopRequireWildcard(require("./test"));
                            }) // FOUR
                        ];
                    case 1:
                        req = _state.sent();
                        return [
                            2
                        ];
                }
            });
        })
    };
};
var l = function() {
    var _ref = _asyncToGenerator(function() {
        var req;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interopRequireWildcard(require("./test"));
                        }) // FIVE
                    ];
                case 1:
                    req = _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
