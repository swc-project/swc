//// [asyncAwaitNestedClasses_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
!function() {
    var _B;
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
    }(), _B);
}(), A.B.C.func();
