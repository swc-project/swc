//// [asyncUnParenthesizedArrowFunction_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var x = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(i) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        someOtherFunction(i)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return function x(i) {
        return _ref.apply(this, arguments);
    };
}();
var x1 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(i) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        someOtherFunction(i)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return function x1(i) {
        return _ref.apply(this, arguments);
    };
}();
