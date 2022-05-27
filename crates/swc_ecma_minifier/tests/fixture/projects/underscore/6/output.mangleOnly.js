_.indexOf = function(b, d, c) {
    if (b == null) return -1;
    var a = 0, e = b.length;
    if (c) {
        if (typeof c == "number") {
            a = c < 0 ? Math.max(0, e + c) : c;
        } else {
            a = _.sortedIndex(b, d);
            return b[a] === d ? a : -1;
        }
    }
    if (nativeIndexOf && b.indexOf === nativeIndexOf) return b.indexOf(d, c);
    for(; a < e; a++)if (b[a] === d) return a;
    return -1;
};
