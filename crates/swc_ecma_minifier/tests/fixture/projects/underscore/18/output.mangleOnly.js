_.sortedIndex = function(a, b, c, d) {
    c = c == null ? _.identity : lookupIterator(c);
    var e = c.call(d, b);
    var f = 0, g = a.length;
    while(f < g){
        var h = (f + g) >>> 1;
        c.call(d, a[h]) < e ? (f = h + 1) : (g = h);
    }
    return f;
};
