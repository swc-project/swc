function a() {}
function b() {}
function c() {}
function d() {}
function e(e, i) {
    if (b(e)) {
        var f = e;
        var g = i;
        var h = 0;
        var j = c(f.valueOf(), h, g, d);
        return f && true === f.isMatrix ? a(j) : j;
    } else {
        var h = e;
        var g = i;
        return d(h, g);
    }
}
