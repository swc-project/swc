function func() {
    foo();
}
if (func() || true) {
    bar();
}
