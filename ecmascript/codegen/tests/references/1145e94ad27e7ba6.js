function a() {
    b();
}
if (a() || true) {
    c();
}
