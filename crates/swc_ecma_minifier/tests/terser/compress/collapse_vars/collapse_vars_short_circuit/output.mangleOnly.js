function a(a) {
    var c = foo(), b = bar();
    return b || a;
}
function b(a) {
    var c = foo(), b = bar();
    return b && a;
}
function c(a) {
    var b = foo(), c = bar();
    return a && b && c;
}
function d(a) {
    var b = foo(), c = bar();
    return b && a;
}
function e(a) {
    var b = foo(), c = bar();
    return b && a && c;
}
function f(a) {
    var b = foo(), c = bar();
    return a || b || c;
}
function g(a) {
    var b = foo(), c = bar();
    return b || a || c;
}
function h(a) {
    var b = foo(), c = bar();
    return b && c && a;
}
function i(a, b) {
    var c = foo(), d = bar();
    return (a || c) && (b || d);
}
function j(a, b) {
    var c = foo(), d = bar();
    return (a && c) || (b && d);
}
function k(a, b) {
    var c = foo(), d = bar();
    return a - c || b - d;
}
function l(a, b) {
    var c = foo(), d = bar();
    return a - d || b - c;
}
function m(a, b) {
    var c = foo(), d = bar();
    return a - b || d - c;
}
function n(a, b) {
    var c = foo(), d = bar();
    return c - d || a - b;
}
function o(a, b) {
    var c = foo(), d = bar();
    return d - c || a - b;
}
