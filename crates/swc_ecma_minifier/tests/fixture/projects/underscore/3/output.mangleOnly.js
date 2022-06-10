_.max = function(a, b, d) {
    if (!b && _.isArray(a) && a[0] === +a[0] && a.length < 65535) {
        return Math.max.apply(Math, a);
    }
    if (!b && _.isEmpty(a)) return -Infinity;
    var c = {
        computed: -Infinity,
        value: -Infinity
    };
    each(a, function(a, f, g) {
        var e = b ? b.call(d, a, f, g) : a;
        e > c.computed && (c = {
            value: a,
            computed: e
        });
    });
    return c.value;
};
