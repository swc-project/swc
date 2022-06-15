function a(a, b, c) {
    c.a = a;
    c.f = b;
    return c;
}
function b(b) {
    return a(1, b, function(a) {
        return b(a);
    });
}
var c = b(function(a) {
    return a;
});
