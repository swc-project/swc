function n() {
    var n;
    n = typeof b === "function" ? b() : b;
    return n !== undefined && c();
}
function t(n) {
    var t;
    n = c();
    t = typeof n === "function" ? n() : n;
    return "stirng" == typeof t && d();
}
function r(t) {
    var n;
    n = b(n / 2);
    if (n < 0) {
        n++;
        ++t;
        return t / 2;
    }
}
function f(t) {
    var n;
    n = b(n / 2);
    if (n < 0) {
        n++;
        t++;
        return t / 2;
    }
}
