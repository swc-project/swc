//// [nullIsSubtypeOfEverythingButUndefined.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A, (f || (f = {})).bar = 1;
var E, c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(c || (c = {})).bar = 1;
