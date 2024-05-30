//// [additionOperatorWithInvalidOperands.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E, C = function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.foo = function() {}, C;
}();
(E = {})[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c", new C(), C.foo();
