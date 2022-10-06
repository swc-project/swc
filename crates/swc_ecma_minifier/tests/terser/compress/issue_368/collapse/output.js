function f1() {
    return ("function" == typeof b ? b() : b) !== void 0 && c();
}
function f2(b1) {
    return "stirng" == typeof ("function" == typeof (b1 = c()) ? b1() : b1) && d();
}
function f3(c1) {
    var a;
    if ((a = b(a / 2)) < 0) return a++, ++c1 / 2;
}
function f4(c1) {
    var a;
    if ((a = b(a / 2)) < 0) return a++, ++c1 / 2;
}
