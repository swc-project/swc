function a(a) {
    var a;
    return typeof a;
}
function b(a) {
    var a = 42;
    return typeof a;
}
function c(a, b) {
    var a = b;
    return typeof a;
}
console.log(a([]), b([]), c([]));
