function f() {
    return g() + h(1) - h(g(), 2, 3);
    function g() {
        return 4;
    }
    function h(a) {
        return a;
    }
}
