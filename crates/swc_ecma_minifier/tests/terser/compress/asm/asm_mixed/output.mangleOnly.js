function a(a, d, b) {
    "use asm";
    var e = a.Math.exp;
    var f = a.Math.log;
    var g = new a.Float64Array(b);
    function h(b, c) {
        b = b | 0;
        c = c | 0;
        var d = 0.0, a = 0, e = 0;
        for(a = b << 3, e = c << 3; (a | 0) < (e | 0); a = (a + 8) | 0){
            d = d + +f(g[a >> 3]);
        }
        return +d;
    }
    function c(a, b) {
        a = a | 0;
        b = b | 0;
        return +e(+h(a, b) / +((b - a) | 0));
    }
    return {
        geometricMean: c
    };
}
function b(a, d, b) {
    var e = a.Math.exp;
    var f = a.Math.log;
    var g = new a.Float64Array(b);
    function h(b, c) {
        b = b | 0;
        c = c | 0;
        var d = 0, a = 0, e = 0;
        for(a = b << 3, e = c << 3; (a | 0) < (e | 0); a = (a + 8) | 0){
            d = d + +f(g[a >> 3]);
        }
        return +d;
    }
    function c(a, b) {
        a = a | 0;
        b = b | 0;
        return +e(+h(a, b) / +((b - a) | 0));
    }
    return {
        geometricMean: c
    };
}
