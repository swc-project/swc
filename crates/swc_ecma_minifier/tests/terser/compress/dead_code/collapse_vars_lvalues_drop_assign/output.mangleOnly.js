function a(a) {
    var b = ++a;
    return (a += b);
}
function b(a) {
    var b = (a -= 3);
    return (a += b);
}
function c(b) {
    var a = b, c = ++a;
    return (a += c);
}
