function f(x, y) {
    var g = function () {
        return h();
    };
    var h = function () {
        return g();
    };
    return x + y;
}
