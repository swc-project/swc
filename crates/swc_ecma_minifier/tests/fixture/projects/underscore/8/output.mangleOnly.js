_.throttle = function(b, c, a) {
    var d, e, f;
    var g = null;
    var h = 0;
    a || (a = {});
    var i = function() {
        h = a.leading === false ? 0 : new Date();
        g = null;
        f = b.apply(d, e);
    };
    return function() {
        var j = new Date();
        if (!h && a.leading === false) h = j;
        var k = c - (j - h);
        d = this;
        e = arguments;
        if (k <= 0) {
            clearTimeout(g);
            g = null;
            h = j;
            f = b.apply(d, e);
        } else if (!g && a.trailing !== false) {
            g = setTimeout(i, k);
        }
        return f;
    };
};
