function r(r, t, n) {
    n.a = r;
    n.f = t;
    return n;
}
function n(n) {
    return r(1, n, function(r) {
        return n(r);
    });
}
var t = n(function(n) {
    return n;
});
