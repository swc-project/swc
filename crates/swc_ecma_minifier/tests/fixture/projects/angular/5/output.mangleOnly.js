function r(e, f, i) {
    var n;
    if (e) {
        if (isFunction(e)) {
            for(n in e){
                if (n != "prototype" && n != "length" && n != "name" && e.hasOwnProperty(n)) {
                    f.call(i, e[n], n);
                }
            }
        } else if (e.forEach && e.forEach !== r) {
            e.forEach(f, i);
        } else if (isArrayLike(e)) {
            for(n = 0; n < e.length; n++)f.call(i, e[n], n);
        } else {
            for(n in e){
                if (e.hasOwnProperty(n)) {
                    f.call(i, e[n], n);
                }
            }
        }
    }
    return e;
}
