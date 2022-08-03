function r(r) {
    if (2 == r) return foo();
    if (3 == r) return bar();
    if (4 == r) return baz();
    fail(r);
}
function e(r) {
    if (a(r)) return foo();
    if (b(r)) return bar();
    if (c(r)) return baz();
    fail(r);
}
function n(r) {
    if (a(r)) return foo();
    else if (b(r)) return bar();
    else if (c(r)) return baz();
    else fail(r);
}
function f(r) {
    if (a(r)) return foo();
    else if (b(r)) return bar();
    else if (c(r)) return baz();
    fail(r);
}
