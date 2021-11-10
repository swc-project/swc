function f() {
    h();
}
function g(a) {
    a();
}
function h(b) {
    g();
    if (b) x();
}
