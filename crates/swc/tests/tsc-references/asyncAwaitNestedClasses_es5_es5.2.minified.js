import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var _B, A = function A() {
    "use strict";
    _class_call_check(this, A);
};
A.B = ((_B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.func2 = function() {
        return new Promise(function(resolve) {
            resolve(null);
        });
    }, B;
}()).C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.func = function() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _B.func2()
                        ];
                    case 1:
                        return _state.sent(), [
                            2
                        ];
                }
            });
        })();
    }, C;
}(), _B), A.B.C.func();
