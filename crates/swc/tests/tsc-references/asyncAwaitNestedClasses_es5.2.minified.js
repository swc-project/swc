//// [asyncAwaitNestedClasses_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var B, __ = new WeakMap(), __1 = new WeakMap(), A = function A() {
    _class_call_check(this, A);
};
__1.set(A, {
    writable: !0,
    value: (B = /*#__PURE__*/ function() {
        function B() {
            _class_call_check(this, B);
        }
        return B.func2 = function() {
            return new Promise(function(resolve) {
                resolve(null);
            });
        }, B;
    }(), __.set(B, {
        writable: !0,
        value: B.C = /*#__PURE__*/ function() {
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
                                    B.func2()
                                ];
                            case 1:
                                return _state.sent(), [
                                    2
                                ];
                        }
                    });
                })();
            }, C;
        }()
    }), A.B = B)
}), A.B.C.func();
