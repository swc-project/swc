_.throttle = function(l, n, a) {
    var e, r, i;
    var t = null;
    var f = 0;
    a || (a = {});
    var u = function() {
        f = a.leading === false ? 0 : new Date();
        t = null;
        i = l.apply(e, r);
    };
    return function() {
        var v = new Date();
        if (!f && a.leading === false) f = v;
        var s = n - (v - f);
        e = this;
        r = arguments;
        if (s <= 0) {
            clearTimeout(t);
            t = null;
            f = v;
            i = l.apply(e, r);
        } else if (!t && a.trailing !== false) {
            t = setTimeout(u, s);
        }
        return i;
    };
};
