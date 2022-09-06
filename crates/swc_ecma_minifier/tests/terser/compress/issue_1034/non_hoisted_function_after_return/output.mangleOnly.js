function n(n) {
    if (n) {
        return t();
        not_called1();
    } else {
        return r();
        not_called2();
    }
    function t() {
        return 7;
    }
    return not_reached;
    function e() {}
    function r() {
        return 8;
    }
}
