var n = console.log;
function r(r, t) {
    var u = t();
    if (r) return r;
    n(u);
}
r(false, function() {
    return 1;
});
r(true, function() {
    return 2;
});
