// @module: es2020
// @target: es2020
// @filename: test.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(function() {
        var req;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./test") // ONE
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
export var cl1 = /*#__PURE__*/ function() {
    "use strict";
    function cl1() {
        _class_call_check(this, cl1);
    }
    var _proto = cl1.prototype;
    _proto.m = function m() {
        return _async_to_generator(function() {
            var req;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import("./test") // TWO
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
export var obj = {
    m: /*#__PURE__*/ _async_to_generator(function() {
        var req;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./test") // THREE
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
export var cl2 = function cl2() {
    "use strict";
    _class_call_check(this, cl2);
    this.p = {
        m: /*#__PURE__*/ _async_to_generator(function() {
            var req;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import("./test") // FOUR
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
export var l = function() {
    var _ref = _async_to_generator(function() {
        var req;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./test") // FIVE
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
