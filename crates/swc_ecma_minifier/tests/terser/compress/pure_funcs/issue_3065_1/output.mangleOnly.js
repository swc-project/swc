function b(b, c, a) {
    a.a = b;
    a.f = c;
    return a;
}
function a(a) {
    return b(1, a, function(b) {
        return a(b);
    });
}
var c = a(function(a) {
    return a;
});
