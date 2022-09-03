//// [additionOperatorWithNumberAndEnum.ts]
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), function(F) {
    F[F.c = 0] = "c", F[F.d = 1] = "d";
}(F || (F = {}));
var E, F, a, b, c, r1 = a + a, r2 = a + b, r3 = b + a, r4 = b + b, r5 = 0 + a, r6 = E.a + 0, r7 = E.a + E.b, r8 = E.a + E.b, r9 = E.a + F.c, r10 = a + c, r11 = c + a, r12 = b + c, r13 = c + b, r14 = c + c;
