//// [additionOperatorWithNullValueAndValidOperator.ts]
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {}));
var E, a, b, c, d, r1 = null + a, r2 = a + null, r3 = null + b, r4 = 1, r5 = null + c, r6 = null + E.a, r7 = null + E.a, r8 = b + null, r9 = 1, r10 = c + null, r11 = E.a + null, r12 = E.a + null, r13 = null + d, r14 = "null", r15 = d + null, r16 = "null";
