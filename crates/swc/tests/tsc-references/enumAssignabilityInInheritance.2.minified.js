//// [enumAssignabilityInInheritance.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), foo(E.A), foo(1), foo(null), foo2(E.A), foo3(E.A), foo4(E.A), foo5(E.A), foo6(E.A), foo7(E.A), foo8(E.A), foo9(E.A), foo10(E.A), foo11(E.A), foo12(E.A), function(E2) {
    E2[E2.A = 0] = "A";
}(E2 || (E2 = {})), foo13(E.A), (f || (f = {})).bar = 1, foo14(E.A);
var E, E2, CC = function CC() {
    "use strict";
    _class_call_check(this, CC);
};
(CC || (CC = {})).bar = 1, foo15(E.A), foo16(E.A), foo16(E.A);
