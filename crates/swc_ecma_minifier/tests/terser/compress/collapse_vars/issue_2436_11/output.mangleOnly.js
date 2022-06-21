function a() {}
function b() {}
function c() {}
function d() {}
function e(e, f) {
    if (b(e)) {
        var g = e;
        var h = f;
        var i = 0;
        var j = c(g.valueOf(), i, h, d);
        return g && true === g.isMatrix ? a(j) : j;
    } else {
        var i = e;
        var h = f;
        return d(i, h);
    }
}
