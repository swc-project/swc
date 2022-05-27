function a(a, b) {
    var c = function() {
        return d();
    };
    var d = function() {
        return c();
    };
    return a + b;
}
