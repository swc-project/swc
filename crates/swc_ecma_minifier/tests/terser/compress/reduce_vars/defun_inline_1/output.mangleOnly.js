function n() {
    return n(2) + r();
    function n(n) {
        return n;
    }
    function r() {
        return r();
    }
}
