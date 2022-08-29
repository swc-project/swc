function r(e, f, l) {
    var o;
    if (e) {
        if (isFunction(e)) {
            for(o in e){
                if (o != "prototype" && o != "length" && o != "name" && e.hasOwnProperty(o)) {
                    f.call(l, e[o], o);
                }
            }
        } else if (e.forEach && e.forEach !== r) {
            e.forEach(f, l);
        } else if (isArrayLike(e)) {
            for(o = 0; o < e.length; o++)f.call(l, e[o], o);
        } else {
            for(o in e){
                if (e.hasOwnProperty(o)) {
                    f.call(l, e[o], o);
                }
            }
        }
    }
    return e;
}
