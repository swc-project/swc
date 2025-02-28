var e = console.log;
function r(r, n) {
    var o = (r <<= n);
    if (r) return r;
    e(o);
}
r(false, 1);
r(true, 2);
