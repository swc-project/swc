//// [asyncAwaitNestedClasses_es5.ts]
// https://github.com/Microsoft/TypeScript/issues/20744
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var _B;
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
A.B = (_B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    B.func2 = function func2() {
        return new Promise(function(resolve) {
            resolve(null);
        });
    };
    return B;
}(), _B.C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.func = function func() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _B.func2()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return C;
}(), _B);
A.B.C.func();
