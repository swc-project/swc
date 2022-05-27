function c() {
    if (foo) return;
    bar();
    baz();
}
function d() {
    if (foo) return;
    if (bar) return;
    if (baz) return;
    if (baa) return;
    a();
    b();
}
