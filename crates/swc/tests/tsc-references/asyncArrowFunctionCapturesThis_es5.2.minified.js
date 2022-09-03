//// [asyncArrowFunctionCapturesThis_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var C = function() {
    "use strict";
    function C() {}
    return C.prototype.method = function() {
        var _this = this;
        _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this
                        ];
                    case 1:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        });
    }, C;
}();
