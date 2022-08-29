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
function r(n) {
    var t;
    t = b(t / 2);
    if (t < 0) {
        t++;
        ++n;
        return n / 2;
    }
}
function f(n) {
    var t;
    t = b(t / 2);
    if (t < 0) {
        t++;
        n++;
        return n / 2;
    }
}
