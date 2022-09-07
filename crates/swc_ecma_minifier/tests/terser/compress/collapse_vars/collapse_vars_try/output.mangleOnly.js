function r() {
    try {
        var r = 1;
        return r;
    } catch (r) {
        var t = 2;
        return t;
    } finally {
        var n = 3;
        return n;
    }
}
function t() {
    var r = could_throw();
    try {
        return r + might_throw();
    } catch (r) {
        return 3;
    }
}
