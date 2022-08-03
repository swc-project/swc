function r() {
    if (foo) return;
    bar();
    baz();
}
function n() {
    if (foo) return;
    if (bar) return;
    if (baz) return;
    if (baa) return;
    a();
    b();
}
