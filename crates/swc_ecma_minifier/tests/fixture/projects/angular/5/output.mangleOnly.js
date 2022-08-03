function f(r, e, l) {
    var a;
    if (r) {
        if (isFunction(r)) {
            for(a in r){
                if (a != "prototype" && a != "length" && a != "name" && r.hasOwnProperty(a)) {
                    e.call(l, r[a], a);
                }
            }
        } else if (r.forEach && r.forEach !== f) {
            r.forEach(e, l);
        } else if (isArrayLike(r)) {
            for(a = 0; a < r.length; a++)e.call(l, r[a], a);
        } else {
            for(a in r){
                if (r.hasOwnProperty(a)) {
                    e.call(l, r[a], a);
                }
            }
        }
    }
    return r;
}
