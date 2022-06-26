var a = function(b, c, d, e) {
    if (b === c) return b !== 0 || 1 / b == 1 / c;
    if (b == null || c == null) return b === c;
    if (b instanceof _) b = b._wrapped;
    if (c instanceof _) c = c._wrapped;
    var f = toString.call(b);
    if (f != toString.call(c)) return false;
    switch(f){
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
    var g = d.length;
    while(g--){
        if (d[g] == b) return e[g] == c;
    }
    var h = b.constructor, i = c.constructor;
    if (h !== i && !(_.isFunction(h) && h instanceof h && _.isFunction(i) && i instanceof i)) {
        return false;
    }
    d.push(b);
    e.push(c);
    var j = 0, k = true;
    if (f == "[object Array]") {
        j = b.length;
        k = j == c.length;
        if (k) {
            while(j--){
                if (!(k = a(b[j], c[j], d, e))) break;
            }
        }
    } else {
        for(var l in b){
            if (_.has(b, l)) {
                j++;
                if (!(k = _.has(c, l) && a(b[l], c[l], d, e))) break;
            }
        }
        if (k) {
            for(l in c){
                if (_.has(c, l) && !j--) break;
            }
            k = !j;
        }
    }
    d.pop();
    e.pop();
    return k;
};
