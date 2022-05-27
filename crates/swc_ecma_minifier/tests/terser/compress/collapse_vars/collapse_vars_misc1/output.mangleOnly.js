function a(a, b, c) {
    var d = 3 - b;
    var e = a;
    var f = 7;
    var g = "run";
    var h = (e[g](d)[f] = c);
    return h;
}
function b(a) {
    var b = 5 - a;
    return b;
}
function c(a) {
    const b = foo(), c = b / (5 - a);
    return c;
}
function d(a) {
    var b = foo(), c = (5 - a) / b;
    return c;
}
function e(c) {
    var a = foo(), b = (5 - u) / a;
    return b;
}
function f(c) {
    const a = foo(), b = (5 - window.x) / a;
    return b;
}
function g() {
    var a = window.a * window.z;
    return a && zap();
}
function h() {
    var a = window.a * window.z;
    return a + a;
}
function i() {
    var a = window.a * window.z;
    var b = a + 5;
    return a + b;
}
function j() {
    var a = window.a * window.z;
    return bar() || a;
}
function k(c) {
    var a = 5, b = 3;
    return (a += b);
}
function l(c) {
    var a = 5, b = 3;
    return (a += --b);
}
