function d(d) {
    if (2 == d) return foo();
    if (3 == d) return bar();
    if (4 == d) return baz();
    fail(d);
}
function e(d) {
    if (a(d)) return foo();
    if (b(d)) return bar();
    if (c(d)) return baz();
    fail(d);
}
function f(d) {
    if (a(d)) return foo();
    else if (b(d)) return bar();
    else if (c(d)) return baz();
    else fail(d);
}
function g(d) {
    if (a(d)) return foo();
    else if (b(d)) return bar();
    else if (c(d)) return baz();
    fail(d);
}
