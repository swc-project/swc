function f(e) {
    return 2 == e ? foo() : 3 == e ? bar() : 4 == e ? baz() : void fail(e);
}
function g(e) {
    return a(e) ? foo() : b(e) ? bar() : c(e) ? baz() : void fail(e);
}
function h(e) {
    return a(e) ? foo() : b(e) ? bar() : c(e) ? baz() : void fail(e);
}
function i(e) {
    return a(e) ? foo() : b(e) ? bar() : c(e) ? baz() : void fail(e);
}
