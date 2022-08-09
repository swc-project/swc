_.sortedIndex = function(l, n, e, r) {
    e = e == null ? _.identity : lookupIterator(e);
    var t = e.call(r, n);
    var a = 0, i = l.length;
    while(a < i){
        var c = (a + i) >>> 1;
        e.call(r, l[c]) < t ? (a = c + 1) : (i = c);
    }
    return a;
};
