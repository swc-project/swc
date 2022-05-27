function a(c, d, e) {
    var b;
    if (c) {
        if (isFunction(c)) {
            for(b in c){
                if (b != "prototype" && b != "length" && b != "name" && c.hasOwnProperty(b)) {
                    d.call(e, c[b], b);
                }
            }
        } else if (c.forEach && c.forEach !== a) {
            c.forEach(d, e);
        } else if (isArrayLike(c)) {
            for(b = 0; b < c.length; b++)d.call(e, c[b], b);
        } else {
            for(b in c){
                if (c.hasOwnProperty(b)) {
                    d.call(e, c[b], b);
                }
            }
        }
    }
    return c;
}
