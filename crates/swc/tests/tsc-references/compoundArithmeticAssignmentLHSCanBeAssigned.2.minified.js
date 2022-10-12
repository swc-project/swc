//// [compoundArithmeticAssignmentLHSCanBeAssigned.ts]
var E, a, b, c, x1, x2, x3;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {})), x1 = (void 0) * (x1 = null * (x1 = (x1 = (x1 *= a) * b) * c)), x2 = (void 0) * (x2 = null * (x2 = (x2 = (x2 *= a) * b) * c)), x3 = (void 0) * (x3 = null * (x3 = (x3 = (x3 *= a) * b) * c));
