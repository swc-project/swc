//// [invalidStringAssignments.ts]
var M, E;
import "@swc/helpers/src/_class_call_check.mjs";
(M || (M = {})).x = 1, M = "", function(E) {
    E[E.A = 0] = "A";
}(E || (E = {}));
