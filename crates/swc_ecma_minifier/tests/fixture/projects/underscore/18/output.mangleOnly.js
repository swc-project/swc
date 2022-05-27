_.sortedIndex = function(e, g, a, f) {
    a = a == null ? _.identity : lookupIterator(a);
    var h = a.call(f, g);
    var b = 0, c = e.length;
    while(b < c){
        var d = (b + c) >>> 1;
        a.call(f, e[d]) < h ? (b = d + 1) : (c = d);
    }
    return b;
};
