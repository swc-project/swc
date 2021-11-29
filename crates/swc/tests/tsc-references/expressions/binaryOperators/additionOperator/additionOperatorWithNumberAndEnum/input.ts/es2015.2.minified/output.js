var E, F, a, b;
let E;
(E = E || (E = {
}))[E.a = 0] = "a", E[E.b = 1] = "b";
let F;
(F = F || (F = {
}))[F.c = 0] = "c", F[F.d = 1] = "d", a + a, a + b, E.a + 0, E.a + E.b, E.a + E.b, E.a + F.c;
