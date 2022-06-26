_.throttle = function(a, b, c) {
    var d, e, f;
    var g = null;
    var h = 0;
    c || (c = {});
    var i = function() {
        h = c.leading === false ? 0 : new Date();
        g = null;
        f = a.apply(d, e);
    };
    return function() {
        var j = new Date();
        if (!h && c.leading === false) h = j;
        var k = b - (j - h);
        d = this;
        e = arguments;
        if (k <= 0) {
            clearTimeout(g);
            g = null;
            h = j;
            f = a.apply(d, e);
        } else if (!g && c.trailing !== false) {
            g = setTimeout(i, k);
        }
        return f;
    };
};
