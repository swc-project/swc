function a(a) {
    var b = ++a;
    return (a += b);
}
function b(a) {
    var b = (a -= 3);
    return (a += b);
}
function c(a) {
    var b = a, c = ++b;
    return (b += c);
}
