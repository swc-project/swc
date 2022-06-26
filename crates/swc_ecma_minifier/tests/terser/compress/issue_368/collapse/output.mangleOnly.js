function a() {
    var a;
    a = typeof b === "function" ? b() : b;
    return a !== undefined && c();
}
function e(a) {
    var e;
    a = c();
    e = typeof a === "function" ? a() : a;
    return "stirng" == typeof e && d();
}
function f(a) {
    var e;
    e = b(e / 2);
    if (e < 0) {
        e++;
        ++a;
        return a / 2;
    }
}
function g(a) {
    var e;
    e = b(e / 2);
    if (e < 0) {
        e++;
        a++;
        return a / 2;
    }
}
