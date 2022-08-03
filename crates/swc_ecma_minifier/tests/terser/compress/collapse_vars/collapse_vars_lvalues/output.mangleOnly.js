function n(n) {
    var r = ++n;
    return (n += r);
}
function r(n) {
    var r = (n -= 3);
    return (n += r);
}
function t(n) {
    var r = n, t = ++r;
    return (r += t);
}
function u(n) {
    var r = (n -= 3), t = n + r;
    return t;
}
function a(n) {
    var r = (n -= 3);
    return n + r;
}
function c(n) {
    var r = e1(), t = e2(), u = (t = --n), a = (r = n);
    return a - u;
}
function e(n) {
    var r = e1(), t = e2(), u = (t = --n), a = (r = n);
    return u - a;
}
function f(n) {
    var r = e1(), t = e2(), u = t - n, a = (r = n);
    return a - u;
}
function i(n) {
    var r = e1(), t = e2(), u = (r = n), a = t - n;
    return u - a;
}
function o(n) {
    var r = e1(), t = e2(), u = (r = n), a = t - n;
    return a - u;
}
