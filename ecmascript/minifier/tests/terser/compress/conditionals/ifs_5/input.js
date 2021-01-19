function f() {
    if (foo) return;
    bar();
    baz();
}
function g() {
    if (foo) return;
    if (bar) return;
    if (baz) return;
    if (baa) return;
    a();
    b();
}
