function r() {
    try {
        var r = 1;
        return r;
    } catch (t) {
        var n = 2;
        return n;
    } finally{
        var u = 3;
        return u;
    }
}
function t() {
    var r = could_throw();
    try {
        return r + might_throw();
    } catch (t) {
        return 3;
    }
}
