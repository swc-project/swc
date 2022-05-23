function f1() {
    return void 0 !== ("function" == typeof b ? b() : b) && c();
}
function f2(b) {
    return "stirng" == typeof ("function" == typeof (b = c()) ? b() : b) && d();
}
function f3(c) {
    var a;
    if ((a = b(a / 2)) < 0) return a++, ++c / 2;
}
function f4(c) {
    var a;
    if ((a = b(a / 2)) < 0) return a++, ++c / 2;
}
