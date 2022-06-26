function a(b, c, d) {
    var e;
    if (b) {
        if (isFunction(b)) {
            for(e in b){
                if (e != "prototype" && e != "length" && e != "name" && b.hasOwnProperty(e)) {
                    c.call(d, b[e], e);
                }
            }
        } else if (b.forEach && b.forEach !== a) {
            b.forEach(c, d);
        } else if (isArrayLike(b)) {
            for(e = 0; e < b.length; e++)c.call(d, b[e], e);
        } else {
            for(e in b){
                if (b.hasOwnProperty(e)) {
                    c.call(d, b[e], e);
                }
            }
        }
    }
    return b;
}
