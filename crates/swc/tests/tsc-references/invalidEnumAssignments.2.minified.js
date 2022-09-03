//// [invalidEnumAssignments.ts]
var E, E2, e, e2;
function f(a) {}
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), function(E2) {
    E2[E2.A = 0] = "A", E2[E2.B = 1] = "B";
}(E2 || (E2 = {})), e = E2.A, e2 = E.A, e = null, e = {}, e = "";
