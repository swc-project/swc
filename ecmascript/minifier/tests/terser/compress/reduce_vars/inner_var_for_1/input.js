function f() {
    var a = 1;
    x(a, b, d);
    for (var b = 2, c = 3; x(a, b, c, d); x(a, b, c, d)) {
        var d = 4,
            e = 5;
        x(a, b, c, d, e);
    }
    x(a, b, c, d, e);
}
