//// [anyAssignableToEveryType2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
(E = {})[E.A = 0] = "A", (f || (f = {})).bar = 1;
var E, c = function c() {
    _class_call_check(this, c);
};
(c || (c = {})).bar = 1;
