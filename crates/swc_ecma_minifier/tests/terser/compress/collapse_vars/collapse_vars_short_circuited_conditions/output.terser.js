function c1(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    return a ? b : c;
}
function c2(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    return a ? c : b;
}
function c3(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    return b ? a : c;
}
function c4(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    return b ? c : a;
}
function c5(x) {
    var a = foo(),
        b = bar();
    return baz() ? a : b;
}
function c6(x) {
    var a = foo(),
        b = bar();
    return baz() ? b : a;
}
function i1(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    if (a) return b;
    else return c;
}
function i2(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    if (a) return c;
    else return b;
}
function i3(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    if (b) return a;
    else return c;
}
function i4(x) {
    var a = foo(),
        b = bar(),
        c = baz();
    if (b) return c;
    else return a;
}
function i5(x) {
    var a = foo(),
        b = bar();
    if (baz()) return a;
    else return b;
}
function i6(x) {
    var a = foo(),
        b = bar();
    if (baz()) return b;
    else return a;
}
