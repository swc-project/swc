//// [compoundArithmeticAssignmentWithInvalidOperands.ts]
var E, a, b, x1, x2, x3, x4, x5, x6;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), x1 = (x1 *= a) * b * 0 * "" * E.a * {} * NaN, x2 = (x2 *= a) * b * 0 * "" * E.a * {} * NaN, x3 = (x3 *= a) * b * 0 * "" * E.a * {} * NaN, x4 = (x4 *= a) * b * 0 * "" * E.a * {} * NaN, x5 = !0 * (x5 *= b) * "" * {}, x6 = !0 * (x6 *= b) * "" * {};
