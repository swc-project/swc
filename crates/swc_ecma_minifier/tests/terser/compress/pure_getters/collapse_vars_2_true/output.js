function f() {
    function g() {}
    g.b = g.a = function () {};
    return g;
}
