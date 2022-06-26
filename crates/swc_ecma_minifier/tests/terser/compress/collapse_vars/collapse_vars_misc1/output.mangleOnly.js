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
function e(a) {
    var b = foo(), c = (5 - u) / b;
    return c;
}
function f(a) {
    const b = foo(), c = (5 - window.x) / b;
    return c;
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
function k(a) {
    var b = 5, c = 3;
    return (b += c);
}
function l(a) {
    var b = 5, c = 3;
    return (b += --c);
}
