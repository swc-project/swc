_.uniq = _.unique = function(n, i, u, a) {
    if (_.isFunction(i)) {
        a = u;
        u = i;
        i = false;
    }
    var t = u ? _.map(n, u, a) : n;
    var f = [];
    var r = [];
    each(t, function(u, a) {
        if (i ? !a || r[r.length - 1] !== u : !_.contains(r, u)) {
            r.push(u);
            f.push(n[a]);
        }
    });
    return f;
};
