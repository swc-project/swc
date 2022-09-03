//// [test.ts]
"use strict";
function _export(target, all) {
    for(var name in all)all[name];
}
exports, exports;
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default, _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _asyncToGenerator(function() {
        var req;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return _interopRequireWildcard(require("./test"));
                        })
                    ];
                case 1:
                    return req = _state.sent(), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
var cl1 = function() {
    "use strict";
    function cl1() {}
    return cl1.prototype.m = function() {
        return _asyncToGenerator(function() {
            var req;
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return _interopRequireWildcard(require("./test"));
                            })
                        ];
                    case 1:
                        return req = _state.sent(), [
                            2
                        ];
                }
            });
        })();
    }, cl1;
}(), obj = {
    m: _asyncToGenerator(function() {
        var req;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return _interopRequireWildcard(require("./test"));
                        })
                    ];
                case 1:
                    return req = _state.sent(), [
                        2
                    ];
            }
        });
    })
}, cl2 = function() {
    "use strict";
    this.p = {
        m: _asyncToGenerator(function() {
            var req;
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return _interopRequireWildcard(require("./test"));
                            })
                        ];
                    case 1:
                        return req = _state.sent(), [
                            2
                        ];
                }
            });
        })
    };
}, l = function() {
    var _ref = _asyncToGenerator(function() {
        var req;
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return _interopRequireWildcard(require("./test"));
                        })
                    ];
                case 1:
                    return req = _state.sent(), [
                        2
                    ];
            }
        });
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
