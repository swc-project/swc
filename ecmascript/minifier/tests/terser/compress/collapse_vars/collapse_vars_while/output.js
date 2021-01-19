function f1(y) {
    var x = y,
        c = 3 - y;
    while (c) return x;
    return y * y;
}
function f2(y) {
    while (y) return 7;
    return y * y;
}
function f3(y) {
    var n = 5 - y;
    while (y) return n;
    return y * y;
}
