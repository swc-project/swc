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
function f(e) {
    var a;
    a = b(a / 2);
    if (a < 0) {
        a++;
        ++e;
        return e / 2;
    }
}
function g(e) {
    var a;
    a = b(a / 2);
    if (a < 0) {
        a++;
        e++;
        return e / 2;
    }
}
