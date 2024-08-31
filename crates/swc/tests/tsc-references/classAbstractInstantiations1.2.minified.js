//// [classAbstractInstantiations1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    _class_call_check(this, A);
}, B = /*#__PURE__*/ function(A) {
    function B() {
        return _class_call_check(this, B), _call_super(this, B, arguments);
    }
    return _inherits(B, A), B;
}(A), C = /*#__PURE__*/ function(B) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, B), C;
}(B);
new A, new A(1), new B, new C, new B, new B, new B;
