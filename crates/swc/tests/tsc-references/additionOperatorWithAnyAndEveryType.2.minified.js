//// [additionOperatorWithAnyAndEveryType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E, M, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.foo = function() {}, C;
}();
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {})), function(M) {
    var a;
    M.a = a;
}(M || (M = {})), new C(), E.a;
