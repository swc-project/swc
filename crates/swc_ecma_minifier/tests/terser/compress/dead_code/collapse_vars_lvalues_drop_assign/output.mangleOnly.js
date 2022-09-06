function n(n) {
    var r = ++n;
    return (n += r);
}
function r(n) {
    var r = (n -= 3);
    return (n += r);
}
function t(n) {
    var r = n,
        t = ++r;
    return (r += t);
}
