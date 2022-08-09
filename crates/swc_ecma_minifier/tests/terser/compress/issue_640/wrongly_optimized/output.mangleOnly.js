function f() {
    foo();
}
if (f() || true) {
    bar();
}
