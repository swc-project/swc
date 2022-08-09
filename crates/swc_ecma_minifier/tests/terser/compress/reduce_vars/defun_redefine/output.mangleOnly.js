function n() {
    function n() {
        return 1;
    }
    function r() {
        return 2;
    }
    n = function() {
        return 3;
    };
    return n() + r();
}
