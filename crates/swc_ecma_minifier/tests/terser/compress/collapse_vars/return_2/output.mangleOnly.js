var r = console.log;
function n(n, t) {
    var u = t();
    if (n) return n;
    r(u);
}
n(false, function() {
    return 1;
});
n(true, function() {
    return 2;
});
