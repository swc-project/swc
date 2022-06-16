function a(a, b) {
    var c = a[b];
    return delete c;
}
function b(a) {
    var b = !!a;
    return a > +b;
}
function c(a) {
    var b = 7;
    return b--;
}
function d(a) {
    var b = 7;
    return ++b;
}
function e(a) {
    var b = 8 - a;
    return b--;
}
function f(a) {
    var b = 9 - a;
    return ++b;
}
