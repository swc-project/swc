_.max = function(u, a, e) {
    if (!a && _.isArray(u) && u[0] === +u[0] && u.length < 65535) {
        return Math.max.apply(Math, u);
    }
    if (!a && _.isEmpty(u)) return -Infinity;
    var r = {
        computed: -Infinity,
        value: -Infinity
    };
    each(u, function(u, t, n) {
        var l = a ? a.call(e, u, t, n) : u;
        l > r.computed && (r = {
            value: u,
            computed: l
        });
    });
    return r.value;
};
