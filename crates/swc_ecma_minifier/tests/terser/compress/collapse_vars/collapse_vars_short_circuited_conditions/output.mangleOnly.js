function a(a) {
    var b = foo(), c = bar(), d = baz();
    return b ? c : d;
}
function b(a) {
    var b = foo(), c = bar(), d = baz();
    return b ? d : c;
}
function c(a) {
    var b = foo(), c = bar(), d = baz();
    return c ? b : d;
}
function d(a) {
    var b = foo(), c = bar(), d = baz();
    return c ? d : b;
}
function e(a) {
    var b = foo(), c = bar(), d = baz();
    return d ? b : c;
}
function f(a) {
    var b = foo(), c = bar(), d = baz();
    return d ? c : b;
}
function g(a) {
    var b = foo(), c = bar(), d = baz();
    if (b) return c;
    else return d;
}
function h(a) {
    var b = foo(), c = bar(), d = baz();
    if (b) return d;
    else return c;
}
function i(a) {
    var b = foo(), c = bar(), d = baz();
    if (c) return b;
    else return d;
}
function j(a) {
    var b = foo(), c = bar(), d = baz();
    if (c) return d;
    else return b;
}
function k(a) {
    var b = foo(), c = bar(), d = baz();
    if (d) return b;
    else return c;
}
function l(a) {
    var b = foo(), c = bar(), d = baz();
    if (d) return c;
    else return b;
}
