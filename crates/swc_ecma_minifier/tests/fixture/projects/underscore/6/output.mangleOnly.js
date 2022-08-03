_.indexOf = function(e, n, r) {
    if (e == null) return -1;
    var f = 0, i = e.length;
    if (r) {
        if (typeof r == "number") {
            f = r < 0 ? Math.max(0, i + r) : r;
        } else {
            f = _.sortedIndex(e, n);
            return e[f] === n ? f : -1;
        }
    }
    if (nativeIndexOf && e.indexOf === nativeIndexOf) return e.indexOf(n, r);
    for(; f < i; f++)if (e[f] === n) return f;
    return -1;
};
