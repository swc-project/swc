_.max = function(t, n, a) {
    if (!n && _.isArray(t) && t[0] === +t[0] && t.length < 65535) {
        return Math.max.apply(Math, t);
    }
    if (!n && _.isEmpty(t)) return -Infinity;
    var i = {
        computed: -Infinity,
        value: -Infinity
    };
    each(t, function(t, e, u) {
        var r = n ? n.call(a, t, e, u) : t;
        r > i.computed && (i = {
            value: t,
            computed: r
        });
    });
    return i.value;
};
