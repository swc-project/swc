//// [additionOperatorWithInvalidOperands.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E, E1, M, C = function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.foo = function() {}, C;
}();
(E = E1 || (E1 = {}))[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c", M || (M = {}), new C(), C.foo();
