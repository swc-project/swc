function t(r, t, n) {
    n.a = r;
    n.f = t;
    return n;
}
function r(n) {
    return t(1, n, function(r) {
        return n(r);
    });
}
var u = r(function(n) {
    return n;
});
function n(n) {
    console.log(n);
}
n(2);
n(3);
