function c(b, c, a) {
    a.a = b;
    a.f = c;
    return a;
}
function b(a) {
    return c(1, a, function(b) {
        return a(b);
    });
}
var d = b(function(a) {
    return a;
});
function a(a) {
    console.log(a);
}
a(2);
a(3);
