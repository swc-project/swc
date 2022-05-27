function b(a) {
    console.log(a);
}
function c(a) {
    return b(a);
}
function a(a) {
    c(a);
}
a(42);
a("PASS");
