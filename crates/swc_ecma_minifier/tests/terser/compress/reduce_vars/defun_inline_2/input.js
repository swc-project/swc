function f() {
    function g(b) {
        return b;
    }
    function h() {
        return h();
    }
    return g(2) + h();
}
