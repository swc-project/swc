function n() {
    i();
}
function f(n) {
    n();
}
function i(n) {
    f();
    if (n) x();
}
