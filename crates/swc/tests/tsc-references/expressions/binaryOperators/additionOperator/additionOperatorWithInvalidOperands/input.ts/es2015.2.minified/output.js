var E, E1, M, a, b;
class C {
    static foo() {
    }
}
(E = E1 || (E1 = {
}))[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c", (function(M1) {
    var a1;
    M1.a = a1;
})(M || (M = {
})), a + a, a + b, E1.a + new C(), E1.a + C.foo(), E1.a + M;
