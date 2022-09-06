var r = console.log;
function e(e, n) {
    var o = (e <<= n);
    if (e) return e;
    r(o);
}
e(false, 1);
e(true, 2);
