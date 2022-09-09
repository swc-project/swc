function n() {
    var n = 1,
        r = 2;
    for (r in (function () {
        return x(n, r, f);
    })()) {
        var f = 3,
            i = 4;
        x(n, r, f, i);
    }
    x(n, r, f, i);
}
