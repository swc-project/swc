function n(n) {
    var r = ++n;
    return (n += r);
}
function r(n) {
    var r = (n -= 3);
    return (n += r);
}
function e(n) {
    var r = n,
        e = ++r;
    return (r += e);
}
function t(n) {
    var r = (n -= 3),
        e = n + r;
    return e;
}
function u(n) {
    var r = (n -= 3);
    return n + r;
}
function a(n) {
    var r = e1(),
        e = e2(),
        t = (e = --n),
        u = (r = n);
    return u - t;
}
function c(n) {
    var r = e1(),
        e = e2(),
        t = (e = --n),
        u = (r = n);
    return t - u;
}
function f(n) {
    var r = e1(),
        e = e2(),
        t = e - n,
        u = (r = n);
    return u - t;
}
function i(n) {
    var r = e1(),
        e = e2(),
        t = (r = n),
        u = e - n;
    return t - u;
}
function o(n) {
    var r = e1(),
        e = e2(),
        t = (r = n),
        u = e - n;
    return u - t;
}
