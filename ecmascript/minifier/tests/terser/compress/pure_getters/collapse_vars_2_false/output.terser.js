function f() {
    function g() {}
    g.a = function () {};
    g.b = g.a;
    return g;
}
