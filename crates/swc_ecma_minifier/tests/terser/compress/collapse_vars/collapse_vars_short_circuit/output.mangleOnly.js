function n(n) {
    var r = foo(), t = bar();
    return t || n;
}
function r(n) {
    var r = foo(), t = bar();
    return t && n;
}
function t(n) {
    var r = foo(), t = bar();
    return n && r && t;
}
function u(n) {
    var r = foo(), t = bar();
    return r && n;
}
function a(n) {
    var r = foo(), t = bar();
    return r && n && t;
}
function c(n) {
    var r = foo(), t = bar();
    return n || r || t;
}
function e(n) {
    var r = foo(), t = bar();
    return r || n || t;
}
function f(n) {
    var r = foo(), t = bar();
    return r && t && n;
}
function i(n, r) {
    var t = foo(), u = bar();
    return (n || t) && (r || u);
}
function o(n, r) {
    var t = foo(), u = bar();
    return (n && t) || (r && u);
}
function v(n, r) {
    var t = foo(), u = bar();
    return n - t || r - u;
}
function b(n, r) {
    var t = foo(), u = bar();
    return n - u || r - t;
}
function d(n, r) {
    var t = foo(), u = bar();
    return n - r || u - t;
}
function g(n, r) {
    var t = foo(), u = bar();
    return t - u || n - r;
}
function h(n, r) {
    var t = foo(), u = bar();
    return u - t || n - r;
}
