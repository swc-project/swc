function n(n) {
    function n() {
        return 1;
    }
    function t() {
        return 2;
    }
    function r() {
        return 3;
    }
    t.inject = [];
    r = function () {
        return 4;
    };
    return n() + t() + r();
}
