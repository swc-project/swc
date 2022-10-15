//// [compoundArithmeticAssignmentLHSCanBeAssigned.ts]
var E, a, b, c, x1, x2, x3;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {})), x1 *= a, x1 *= b, x1 *= c, x1 *= null, x1 *= void 0, x2 *= a, x2 *= b, x2 *= c, x2 *= null, x2 *= void 0, x3 *= a, x3 *= b, x3 *= c, x3 *= null, x3 *= void 0;
