function a(d) {
    var a = foo(), b = bar(), c = baz();
    return a ? b : c;
}
function b(d) {
    var a = foo(), b = bar(), c = baz();
    return a ? c : b;
}
function c(d) {
    var a = foo(), b = bar(), c = baz();
    return b ? a : c;
}
function d(d) {
    var a = foo(), b = bar(), c = baz();
    return b ? c : a;
}
function e(d) {
    var a = foo(), b = bar(), c = baz();
    return c ? a : b;
}
function f(d) {
    var a = foo(), b = bar(), c = baz();
    return c ? b : a;
}
function g(d) {
    var a = foo(), b = bar(), c = baz();
    if (a) return b;
    else return c;
}
function h(d) {
    var a = foo(), b = bar(), c = baz();
    if (a) return c;
    else return b;
}
function i(d) {
    var a = foo(), b = bar(), c = baz();
    if (b) return a;
    else return c;
}
function j(d) {
    var a = foo(), b = bar(), c = baz();
    if (b) return c;
    else return a;
}
function k(d) {
    var a = foo(), b = bar(), c = baz();
    if (c) return a;
    else return b;
}
function l(d) {
    var a = foo(), b = bar(), c = baz();
    if (c) return b;
    else return a;
}
