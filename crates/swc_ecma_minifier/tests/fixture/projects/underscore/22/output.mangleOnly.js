_.indexOf = function(a, b, c) {
    if (a == null) return -1;
    var d = 0, e = a.length;
    if (c) {
        if (typeof c == "number") {
            d = c < 0 ? Math.max(0, e + c) : c;
        } else {
            d = _.sortedIndex(a, b);
            return a[d] === b ? d : -1;
        }
    }
    if (nativeIndexOf && a.indexOf === nativeIndexOf) return a.indexOf(b, c);
    for(; d < e; d++)if (a[d] === b) return d;
    return -1;
};
