function a() {
    if (b) return;
    c();
    d();
}
function e() {
    if (b) return;
    if (c) return;
    if (d) return;
    if (f) return;
    g();
    h();
}
