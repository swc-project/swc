_.throttle = function(e, a, l) {
    var n, t, i;
    var r = null;
    var u = 0;
    l || (l = {});
    var f = function() {
        u = l.leading === false ? 0 : new Date();
        r = null;
        i = e.apply(n, t);
    };
    return function() {
        var o = new Date();
        if (!u && l.leading === false) u = o;
        var s = a - (o - u);
        n = this;
        t = arguments;
        if (s <= 0) {
            clearTimeout(r);
            r = null;
            u = o;
            i = e.apply(n, t);
        } else if (!r && l.trailing !== false) {
            r = setTimeout(f, s);
        }
        return i;
    };
};
