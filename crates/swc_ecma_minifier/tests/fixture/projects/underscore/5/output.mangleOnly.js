_.uniq = _.unique = function(n, i, u, a) {
    if (_.isFunction(i)) {
        a = u;
        u = i;
        i = false;
    }
    var t = u ? _.map(n, u, a) : n;
    var c = [];
    var e = [];
    each(t, function(u, a) {
        if (i ? !a || e[e.length - 1] !== u : !_.contains(e, u)) {
            e.push(u);
            c.push(n[a]);
        }
    });
    return c;
};
