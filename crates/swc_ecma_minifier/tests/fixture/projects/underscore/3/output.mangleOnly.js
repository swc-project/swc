_.max = function(a, b, c) {
    if (!b && _.isArray(a) && a[0] === +a[0] && a.length < 65535) {
        return Math.max.apply(Math, a);
    }
    if (!b && _.isEmpty(a)) return -Infinity;
    var d = {
        computed: -Infinity,
        value: -Infinity
    };
    each(a, function(a, e, f) {
        var g = b ? b.call(c, a, e, f) : a;
        g > d.computed && (d = {
            value: a,
            computed: g
        });
    });
    return d.value;
};
