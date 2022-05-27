function a(a, b) {
    var c = a[b];
    return delete c;
}
function b(a) {
    var b = !!a;
    return a > +b;
}
function c(b) {
    var a = 7;
    return a--;
}
function d(b) {
    var a = 7;
    return ++a;
}
function e(a) {
    var b = 8 - a;
    return b--;
}
function f(a) {
    var b = 9 - a;
    return ++b;
}
