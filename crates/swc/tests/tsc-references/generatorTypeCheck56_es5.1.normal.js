//@target: ES6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function g() {
    var x;
    return _ts_generator(this, function(_state) {
        x = /*#__PURE__*/ function() {
            "use strict";
            function C() {
                _class_call_check(this, C);
            }
            var _proto = C.prototype;
            _proto[yield 0] = function() {
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                0
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            };
            return C;
        }();
        return [
            2
        ];
    });
}
