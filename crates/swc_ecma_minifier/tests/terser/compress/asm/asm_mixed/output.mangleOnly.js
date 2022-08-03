function r(r, $, n) {
    "use asm";
    var t = r.Math.exp;
    var a = r.Math.log;
    var e = new r.Float64Array(n);
    function o(r, $) {
        r = r | 0;
        $ = $ | 0;
        var n = 0.0, t = 0, o = 0;
        for(t = r << 3, o = $ << 3; (t | 0) < (o | 0); t = (t + 8) | 0){
            n = n + +a(e[t >> 3]);
        }
        return +n;
    }
    function u(r, $) {
        r = r | 0;
        $ = $ | 0;
        return +t(+o(r, $) / +(($ - r) | 0));
    }
    return {
        geometricMean: u
    };
}
function $(r, $, n) {
    var t = r.Math.exp;
    var a = r.Math.log;
    var e = new r.Float64Array(n);
    function o(r, $) {
        r = r | 0;
        $ = $ | 0;
        var n = 0, t = 0, o = 0;
        for(t = r << 3, o = $ << 3; (t | 0) < (o | 0); t = (t + 8) | 0){
            n = n + +a(e[t >> 3]);
        }
        return +n;
    }
    function u(r, $) {
        r = r | 0;
        $ = $ | 0;
        return +t(+o(r, $) / +(($ - r) | 0));
    }
    return {
        geometricMean: u
    };
}
