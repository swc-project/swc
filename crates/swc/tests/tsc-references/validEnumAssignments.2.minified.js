//// [validEnumAssignments.ts]
var E;
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), E.A, E.A, E.A, E.B;
