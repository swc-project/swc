//// [invalidUndefinedAssignments.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), (E = x).A = x;
var x, E, f, g, M, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function i(a) {}
C = x, g = x, I = x, (M || (M = {})).x = 1, M = x, i = x;
