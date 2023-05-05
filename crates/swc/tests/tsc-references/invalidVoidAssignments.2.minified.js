//// [invalidVoidAssignments.ts]
var x, M, E;
import "@swc/helpers/_/_class_call_check";
(M || (M = {})).x = 1, M = x, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), x = E, x = E.A;
