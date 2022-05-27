_.uniq = _.unique = function(c, b, a, d) {
    if (_.isFunction(b)) {
        d = a;
        a = b;
        b = false;
    }
    var e = a ? _.map(c, a, d) : c;
    var f = [];
    var g = [];
    each(e, function(a, d) {
        if (b ? !d || g[g.length - 1] !== a : !_.contains(g, a)) {
            g.push(a);
            f.push(c[d]);
        }
    });
    return f;
};
