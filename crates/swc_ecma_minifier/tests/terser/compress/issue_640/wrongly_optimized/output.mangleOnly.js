function a() {
    foo();
}
if (a() || true) {
    bar();
}
