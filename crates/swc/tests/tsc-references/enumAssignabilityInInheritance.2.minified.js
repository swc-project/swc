//// [enumAssignabilityInInheritance.ts]
// enum is only a subtype of number, no types are subtypes of enum, all of these except the first are errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
(E = E1 || (E1 = {}))[E.A = 0] = "A", foo(0), foo(1), foo(null), foo2(0), foo3(0), foo4(0), foo5(0), foo6(0), foo7(0), foo8(0), foo9(0), foo10(0), foo11(0), foo12(0), (E2 = E21 || (E21 = {}))[E2.A = 0] = "A", foo13(0), (f || (f = {})).bar = 1, foo14(0);
var E, E2, E1, E21, CC = function CC() {
    _class_call_check(this, CC);
};
(CC || (CC = {})).bar = 1, foo15(0), foo16(0), foo16(0);
