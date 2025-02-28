function r(r, a, n) {
    "use asm";
    var e = r.Math.exp;
    var o = r.Math.log;
    var u = new r.Float64Array(n);
    function c(r, n) {
        r = r | 0;
        n = n | 0;
        var t = 0.0, a = 0, e = 0;
        for(a = r << 3, e = n << 3; (a | 0) < (e | 0); a = (a + 8) | 0){
            t = t + +o(u[a >> 3]);
        }
        return +t;
    }
    function t(r, n) {
        r = r | 0;
        n = n | 0;
        return +e(+c(r, n) / +((n - r) | 0));
    }
    return {
        geometricMean: t
    };
}
function n(r, a, n) {
    var e = r.Math.exp;
    var o = r.Math.log;
    var u = new r.Float64Array(n);
    function c(r, n) {
        r = r | 0;
        n = n | 0;
        var t = 0, a = 0, e = 0;
        for(a = r << 3, e = n << 3; (a | 0) < (e | 0); a = (a + 8) | 0){
            t = t + +o(u[a >> 3]);
        }
        return +t;
    }
    function t(r, n) {
        r = r | 0;
        n = n | 0;
        return +e(+c(r, n) / +((n - r) | 0));
    }
    return {
        geometricMean: t
    };
}
