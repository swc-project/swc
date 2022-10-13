//// [compoundAdditionAssignmentLHSCanBeAssigned.ts]
var E, a, b, x1, x2, x3, x4, x6;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), x1 = (x1 += a) + b + !0 + 0 + "" + E.a + "[object Object]nullundefined", x2 = (x2 += a) + b + !0 + 0 + "" + E.a + "[object Object]nullundefined", x3 = (x3 += a) + 0 + E.a + null + void 0, x4 = (x4 += a) + 0 + E.a + null + void 0, x6 = (x6 += a) + "";
