_.sortedIndex = function(l, r, t, e) {
    t = t == null ? _.identity : lookupIterator(t);
    var n = t.call(e, r);
    var a = 0, o = l.length;
    while(a < o){
        var i = (a + o) >>> 1;
        t.call(e, l[i]) < n ? (a = i + 1) : (o = i);
    }
    return a;
};
