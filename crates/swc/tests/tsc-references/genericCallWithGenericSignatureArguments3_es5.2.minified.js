var E, F;
new Object(), function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.A = 0] = "A";
}(F || (F = {})), E.A;
