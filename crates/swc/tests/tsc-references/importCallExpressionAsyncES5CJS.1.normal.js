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
    cl1: function() {
        return cl1;
    },
    cl2: function() {
        return cl2;
    },
    fn: function() {
        return fn;
    },
    l: function() {
        return l;
    },
    obj: function() {
        return obj;
    }
});
var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator._(function() {
        var req;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interop_require_wildcard._(require("./test"));
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
        _class_call_check._(this, cl1);
    }
    var _proto = cl1.prototype;
    _proto.m = function m() {
        return _async_to_generator._(function() {
            var req;
            return _ts_generator._(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return /*#__PURE__*/ _interop_require_wildcard._(require("./test"));
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
    m: /*#__PURE__*/ _async_to_generator._(function() {
        var req;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interop_require_wildcard._(require("./test"));
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
    _class_call_check._(this, cl2);
    this.p = {
        m: /*#__PURE__*/ _async_to_generator._(function() {
            var req;
            return _ts_generator._(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return /*#__PURE__*/ _interop_require_wildcard._(require("./test"));
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
var l = /*#__PURE__*/ function() {
    var _ref = _async_to_generator._(function() {
        var req;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interop_require_wildcard._(require("./test"));
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
