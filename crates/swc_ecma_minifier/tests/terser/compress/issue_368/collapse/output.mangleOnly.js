function n() {
    var n;
    n = typeof b === "function" ? b() : b;
    return n !== undefined && c();
}
function r(n) {
    var r;
    n = c();
    r = typeof n === "function" ? n() : n;
    return "stirng" == typeof r && d();
}
function t(n) {
    var r;
    r = b(r / 2);
    if (r < 0) {
        r++;
        ++n;
        return n / 2;
    }
}
function f(n) {
    var r;
    r = b(r / 2);
    if (r < 0) {
        r++;
        n++;
        return n / 2;
    }
}
