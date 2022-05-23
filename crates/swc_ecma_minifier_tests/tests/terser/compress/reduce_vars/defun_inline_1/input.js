function f() {
    return g(2) + h();
    function g(b) {
        return b;
    }
    function h() {
        return h();
    }
}
