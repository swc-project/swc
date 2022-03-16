var E, F, a, b;
(function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
})(E || (E = {})), function(F) {
    F[F.c = 0] = "c", F[F.d = 1] = "d";
}(F || (F = {})), Math.pow(E.a, a), Math.pow(E.a, b), Math.pow(E.a, E.b), Math.pow(E.a, 1), Math.pow(a, E.b), Math.pow(b, E.b), Math.pow(1, E.b);
