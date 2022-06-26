export const obj = {
    each: function(a, b, c) {
        var d, e = 0, f = a.length, g = isArraylike(a);
        if (c) {
            if (g) {
                for(; e < f; e++){
                    d = b.apply(a[e], c);
                    if (d === false) {
                        break;
                    }
                }
            } else {
                for(e in a){
                    d = b.apply(a[e], c);
                    if (d === false) {
                        break;
                    }
                }
            }
        } else {
            if (g) {
                for(; e < f; e++){
                    d = b.call(a[e], e, a[e]);
                    if (d === false) {
                        break;
                    }
                }
            } else {
                for(e in a){
                    d = b.call(a[e], e, a[e]);
                    if (d === false) {
                        break;
                    }
                }
            }
        }
        return a;
    }
};
