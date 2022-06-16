function a(a) {
    console.log(a);
}
function b(b) {
    return a(b);
}
function c(a) {
    b(a);
}
c(42);
c("PASS");
