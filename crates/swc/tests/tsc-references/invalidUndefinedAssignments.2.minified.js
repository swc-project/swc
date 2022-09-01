//// [invalidUndefinedAssignments.ts]
var x, E, M;
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), (E = x).A = x, I = x, (M || (M = {})).x = 1, M = x;
