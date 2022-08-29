//// [exponentiationOperatorWithEnumUnion.ts]
var E, F;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), function(F) {
    F[F.c = 0] = "c", F[F.d = 1] = "d";
}(F || (F = {})), E.a, E.a, E.a, E.b, E.a, E.b, E.b, E.b;
