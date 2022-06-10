var a = function(b, c, f, h) {
    if (b === c) return b !== 0 || 1 / b == 1 / c;
    if (b == null || c == null) return b === c;
    if (b instanceof _) b = b._wrapped;
    if (c instanceof _) c = c._wrapped;
    var k = toString.call(b);
    if (k != toString.call(c)) return false;
    switch(k){
        case "[object String]":
            return b == String(c);
        case "[object Number]":
            return b != +b ? c != +c : b == 0 ? 1 / b == 1 / c : b == +c;
        case "[object Date]":
        case "[object Boolean]":
            return +b == +c;
        case "[object RegExp]":
            return (b.source == c.source && b.global == c.global && b.multiline == c.multiline && b.ignoreCase == c.ignoreCase);
    }
    if (typeof b != "object" || typeof c != "object") return false;
    var l = f.length;
    while(l--){
        if (f[l] == b) return h[l] == c;
    }
    var i = b.constructor, j = c.constructor;
    if (i !== j && !(_.isFunction(i) && i instanceof i && _.isFunction(j) && j instanceof j)) {
        return false;
    }
    f.push(b);
    h.push(c);
    var d = 0, e = true;
    if (k == "[object Array]") {
        d = b.length;
        e = d == c.length;
        if (e) {
            while(d--){
                if (!(e = a(b[d], c[d], f, h))) break;
            }
        }
    } else {
        for(var g in b){
            if (_.has(b, g)) {
                d++;
                if (!(e = _.has(c, g) && a(b[g], c[g], f, h))) break;
            }
        }
        if (e) {
            for(g in c){
                if (_.has(c, g) && !d--) break;
            }
            e = !d;
        }
    }
    f.pop();
    h.pop();
    return e;
};
