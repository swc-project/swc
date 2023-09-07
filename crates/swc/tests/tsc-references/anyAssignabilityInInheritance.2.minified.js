//// [anyAssignabilityInInheritance.ts]
// any is not a subtype of any other types, errors expected on all the below derived classes unless otherwise noted
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
foo2(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), foo3(a), (E = E1 || (E1 = {}))[E.A = 0] = "A", foo3(a), f1 = f || (f = {}), bar1 = 1, Object.defineProperty(f1, "bar", {
    enumerable: !0,
    get: function() {
        return bar1;
    },
    set: function(v) {
        bar1 = v;
    }
}), foo3(a);
var CC, bar, E, f1, bar1, a, E1, CC1 = function CC() {
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
}), foo3(a), foo3(a), foo3(a);
 // any
