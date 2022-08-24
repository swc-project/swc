// @target: ES6
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var other = function other() {};
        var _this = this, _arguments = arguments;
        var fn = function() {
            var _ref = _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                other.apply(_this, _arguments)
                            ];
                        case 1:
                            return [
                                2,
                                _state.sent()
                            ];
                    }
                });
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    };
    return C;
}();
