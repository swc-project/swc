function f(e) {
    if (2 == e) return foo();
    if (3 == e) return bar();
    if (4 == e) return baz();
    fail(e);
}
function g(e) {
    if (a(e)) return foo();
    if (b(e)) return bar();
    if (c(e)) return baz();
    fail(e);
}
function h(e) {
    if (a(e)) return foo();
    else if (b(e)) return bar();
    else if (c(e)) return baz();
    else fail(e);
}
function i(e) {
    if (a(e)) return foo();
    else if (b(e)) return bar();
    else if (c(e)) return baz();
    fail(e);
}
