//// [enumIsNotASubtypeOfAnythingButNumber.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(E2) {
    E2[E2.A = 0] = "A";
}(E2 || (E2 = {})), (f || (f = {})).bar = 1;
var E, E2, c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(c || (c = {})).bar = 1;
