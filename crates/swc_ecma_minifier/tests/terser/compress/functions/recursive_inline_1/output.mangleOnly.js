function a() {
    c();
}
function b(a) {
    a();
}
function c(a) {
    b();
    if (a) x();
}
