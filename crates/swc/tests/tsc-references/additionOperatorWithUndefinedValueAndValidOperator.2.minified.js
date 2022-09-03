//// [additionOperatorWithUndefinedValueAndValidOperator.ts]
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {}));
var E, a, b, c, d, r1 = (void 0) + a, r2 = a + void 0, r3 = (void 0) + b, r4 = NaN, r5 = (void 0) + c, r6 = (void 0) + E.a, r7 = (void 0) + E.a, r8 = b + void 0, r9 = NaN, r10 = c + void 0, r11 = E.a + void 0, r12 = E.a + void 0, r13 = (void 0) + d, r14 = "undefined", r15 = d + void 0, r16 = "undefined";
