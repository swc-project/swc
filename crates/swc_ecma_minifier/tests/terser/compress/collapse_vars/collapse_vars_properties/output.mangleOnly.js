function a(a) {
    var b = "LiteralProperty";
    return !!-+a[b];
}
function b(a) {
    var b = "One";
    var c = "Two";
    return ~!!-+a[b + c];
}
