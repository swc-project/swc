function a(a) {
    var b = ++a;
    return (a += b);
}
function b(a) {
    var b = (a -= 3);
    return (a += b);
}
function c(b) {
    var a = b, c = ++a;
    return (a += c);
}
function d(a) {
    var b = (a -= 3), c = a + b;
    return c;
}
function e(a) {
    var b = (a -= 3);
    return a + b;
}
function f(a) {
    var b = e1(), c = e2(), d = (c = --a), e = (b = a);
    return e - d;
}
function g(a) {
    var b = e1(), c = e2(), d = (c = --a), e = (b = a);
    return d - e;
}
function h(a) {
    var b = e1(), c = e2(), d = c - a, e = (b = a);
    return e - d;
}
function i(a) {
    var b = e1(), c = e2(), d = (b = a), e = c - a;
    return d - e;
}
function j(a) {
    var b = e1(), c = e2(), d = (b = a), e = c - a;
    return e - d;
}
