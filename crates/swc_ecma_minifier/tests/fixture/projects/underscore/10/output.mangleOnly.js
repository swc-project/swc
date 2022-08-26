var e = function(r, t, n, i) {
    if (r === t) return r !== 0 || 1 / r == 1 / t;
    if (r == null || t == null) return r === t;
    if (r instanceof _) r = r._wrapped;
    if (t instanceof _) t = t._wrapped;
    var a = toString.call(r);
    if (a != toString.call(t)) return false;
    switch(a){
        case "[object String]":
            return r == String(t);
        case "[object Number]":
            return r != +r ? t != +t : r == 0 ? 1 / r == 1 / t : r == +t;
        case "[object Date]":
        case "[object Boolean]":
            return +r == +t;
        case "[object RegExp]":
            return (r.source == t.source && r.global == t.global && r.multiline == t.multiline && r.ignoreCase == t.ignoreCase);
    }
    if (typeof r != "object" || typeof t != "object") return false;
    var o = n.length;
    while(o--){
        if (n[o] == r) return i[o] == t;
    }
    var c = r.constructor, f = t.constructor;
    if (c !== f && !(_.isFunction(c) && c instanceof c && _.isFunction(f) && f instanceof f)) {
        return false;
    }
    n.push(r);
    i.push(t);
    var s = 0, l = true;
    if (a == "[object Array]") {
        s = r.length;
        l = s == t.length;
        if (l) {
            while(s--){
                if (!(l = e(r[s], t[s], n, i))) break;
            }
        }
    } else {
        for(var u in r){
            if (_.has(r, u)) {
                s++;
                if (!(l = _.has(t, u) && e(r[u], t[u], n, i))) break;
            }
        }
        if (l) {
            for(u in t){
                if (_.has(t, u) && !s--) break;
            }
            l = !s;
        }
    }
    n.pop();
    i.pop();
    return l;
};
