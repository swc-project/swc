function a(a) {
    return console.log(a), a;
}
function b(a) {
    var b = 3 / a;
    return (b = b);
}
function c(a) {
    const b = 3 / a;
    const c = 1 - b;
    return c;
}
function d(b) {
    var c = 3 / b;
    var d = c - 7;
    return a((b = d));
}
function e(b) {
    var c = 3 / b;
    var d = c - 7;
    return a((b |= d));
}
function f(b) {
    var c = 3 / b;
    var d = 2;
    return a((d += c));
}
function h(b) {
    var c = 2;
    var d = 3 / b;
    return a((c += d));
}
function i(b) {
    var c = g();
    var d = 3 / b;
    return a((c += d));
}
