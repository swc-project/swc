_.uniq = _.unique = function(a, b, c, d) {
    if (_.isFunction(b)) {
        d = c;
        c = b;
        b = false;
    }
    var e = c ? _.map(a, c, d) : a;
    var f = [];
    var g = [];
    each(e, function(c, d) {
        if (b ? !d || g[g.length - 1] !== c : !_.contains(g, c)) {
            g.push(c);
            f.push(a[d]);
        }
    });
    return f;
};
