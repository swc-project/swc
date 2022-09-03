//// [compoundAdditionAssignmentLHSCannotBeAssigned.ts]
var E, x1, x2, x3, x4, x5;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {}));
