function n() {
    return n() + r(1) - r(n(), 2, 3);
    function n() {
        return 4;
    }
    function r(n) {
        return n;
    }
}
