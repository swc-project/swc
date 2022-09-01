//// [validNullAssignments.ts]
var E, M;
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A = null, I = null, (M || (M = {})).x = 1, M = null;
