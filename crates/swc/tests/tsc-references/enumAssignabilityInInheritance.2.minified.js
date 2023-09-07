//// [enumAssignabilityInInheritance.ts]
// enum is only a subtype of number, no types are subtypes of enum, all of these except the first are errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
(E = E1 || (E1 = {}))[E.A = 0] = "A", foo(0), foo(1), foo(null), foo2(0), foo3(0), foo4(0), foo5(0), foo6(0), foo7(0), foo8(0), foo9(0), foo10(0), foo11(0), foo12(0), (E2 = E21 || (E21 = {}))[E2.A = 0] = "A", foo13(0), f1 = f || (f = {}), bar1 = 1, Object.defineProperty(f1, "bar", {
    enumerable: !0,
    get: function() {
        return bar1;
    },
    set: function(v) {
        bar1 = v;
    }
}), foo14(0);
var CC, bar, E, E2, f1, bar1, E1, E21, CC1 = function CC() {
    _class_call_check(this, CC);
};
CC = CC1 || (CC1 = {}), bar = 1, Object.defineProperty(CC, "bar", {
    enumerable: !0,
    get: function() {
        return bar;
    },
    set: function(v) {
        bar = v;
    }
}), foo15(0), foo16(0), foo16(0);
