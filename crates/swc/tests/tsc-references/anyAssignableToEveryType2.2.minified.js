//// [anyAssignableToEveryType2.ts]
// any is not a subtype of any other types, but is assignable, all the below should work
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
(E = E1 || (E1 = {}))[E.A = 0] = "A", (f || (f = {})).bar = 1;
var E, E1, c = function c() {
    _class_call_check(this, c);
};
(c || (c = {})).bar = 1;
