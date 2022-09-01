//// [invalidBooleanAssignments.ts]
var E, M;
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), (M || (M = {})).a = 1, M = !0;
