var e = function(r, n, i, a) {
    if (r === n) return r !== 0 || 1 / r == 1 / n;
    if (r == null || n == null) return r === n;
    if (r instanceof _) r = r._wrapped;
    if (n instanceof _) n = n._wrapped;
    var t = toString.call(r);
    if (t != toString.call(n)) return false;
    switch(t){
        case "[object String]":
            return r == String(n);
        case "[object Number]":
            return r != +r ? n != +n : r == 0 ? 1 / r == 1 / n : r == +n;
        case "[object Date]":
        case "[object Boolean]":
            return +r == +n;
        case "[object RegExp]":
            return (r.source == n.source && r.global == n.global && r.multiline == n.multiline && r.ignoreCase == n.ignoreCase);
    }
    if (typeof r != "object" || typeof n != "object") return false;
    var f = i.length;
    while(f--){
        if (i[f] == r) return a[f] == n;
    }
    var s = r.constructor, l = n.constructor;
    if (s !== l && !(_.isFunction(s) && s instanceof s && _.isFunction(l) && l instanceof l)) {
        return false;
    }
    i.push(r);
    a.push(n);
    var u = 0, o = true;
    if (t == "[object Array]") {
        u = r.length;
        o = u == n.length;
        if (o) {
            while(u--){
                if (!(o = e(r[u], n[u], i, a))) break;
            }
        }
    } else {
        for(var c in r){
            if (_.has(r, c)) {
                u++;
                if (!(o = _.has(n, c) && e(r[c], n[c], i, a))) break;
            }
        }
        if (o) {
            for(c in n){
                if (_.has(n, c) && !u--) break;
            }
            o = !u;
        }
    }
    i.pop();
    a.pop();
    return o;
};
