//// [asyncFunctionDeclarationCapturesArguments_es5.ts]
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
        function fn() {
            return _fn.apply(this, arguments);
        }
        function _fn() {
            _fn = _async_to_generator(function() {
                var _arguments = arguments;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                other.apply(this, _arguments)
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            });
            return _fn.apply(this, arguments);
        }
    };
    return C;
}();
