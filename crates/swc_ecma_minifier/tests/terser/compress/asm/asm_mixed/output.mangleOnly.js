function r(r, n, t) {
    "use asm";
    var a = r.Math.exp;
    var e = r.Math.log;
    var o = new r.Float64Array(t);
    function u(r, n) {
        r = r | 0;
        n = n | 0;
        var t = 0.0,
            a = 0,
            u = 0;
        for (a = r << 3, u = n << 3; (a | 0) < (u | 0); a = (a + 8) | 0) {
            t = t + +e(o[a >> 3]);
        }
        return +t;
    }
    function c(r, n) {
        r = r | 0;
        n = n | 0;
        return +a(+u(r, n) / +((n - r) | 0));
    }
    return { geometricMean: c };
}
function n(r, n, t) {
    var a = r.Math.exp;
    var e = r.Math.log;
    var o = new r.Float64Array(t);
    function u(r, n) {
        r = r | 0;
        n = n | 0;
        var t = 0,
            a = 0,
            u = 0;
        for (a = r << 3, u = n << 3; (a | 0) < (u | 0); a = (a + 8) | 0) {
            t = t + +e(o[a >> 3]);
        }
        return +t;
    }
    function c(r, n) {
        r = r | 0;
        n = n | 0;
        return +a(+u(r, n) / +((n - r) | 0));
    }
    return { geometricMean: c };
}
