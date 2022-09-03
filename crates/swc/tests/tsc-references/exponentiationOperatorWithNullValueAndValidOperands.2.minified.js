//// [exponentiationOperatorWithNullValueAndValidOperands.ts]
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {}));
var E, a, b, r1 = Math.pow(null, a), r2 = Math.pow(null, b), r3 = 0, r4 = Math.pow(null, E.a), r5 = Math.pow(a, null), r6 = Math.pow(b, null), r7 = 1, r8 = Math.pow(E.b, null);
