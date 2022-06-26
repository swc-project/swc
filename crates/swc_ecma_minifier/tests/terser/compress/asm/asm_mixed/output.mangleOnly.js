function a(a, b, c) {
    "use asm";
    var d = a.Math.exp;
    var e = a.Math.log;
    var f = new a.Float64Array(c);
    function g(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0.0, d = 0, g = 0;
        for(d = a << 3, g = b << 3; (d | 0) < (g | 0); d = (d + 8) | 0){
            c = c + +e(f[d >> 3]);
        }
        return +c;
    }
    function h(a, b) {
        a = a | 0;
        b = b | 0;
        return +d(+g(a, b) / +((b - a) | 0));
    }
    return {
        geometricMean: h
    };
}
function b(a, b, c) {
    var d = a.Math.exp;
    var e = a.Math.log;
    var f = new a.Float64Array(c);
    function g(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, g = 0;
        for(d = a << 3, g = b << 3; (d | 0) < (g | 0); d = (d + 8) | 0){
            c = c + +e(f[d >> 3]);
        }
        return +c;
    }
    function h(a, b) {
        a = a | 0;
        b = b | 0;
        return +d(+g(a, b) / +((b - a) | 0));
    }
    return {
        geometricMean: h
    };
}
