function f(x, y) {
    function g() {
        return h();
    }
    function h() {
        return g();
    }
    return x + y;
}
