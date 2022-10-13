//// [compoundArithmeticAssignmentLHSCanBeAssigned.ts]
var E, a, b, c, x1, x2, x3;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {})), x1 = (x1 *= a) * b * c * NaN, x2 = (x2 *= a) * b * c * NaN, x3 = (x3 *= a) * b * c * NaN;
