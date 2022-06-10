export const obj = {
    each: function(b, d, e) {
        var c, a = 0, f = b.length, g = isArraylike(b);
        if (e) {
            if (g) {
                for(; a < f; a++){
                    c = d.apply(b[a], e);
                    if (c === false) {
                        break;
                    }
                }
            } else {
                for(a in b){
                    c = d.apply(b[a], e);
                    if (c === false) {
                        break;
                    }
                }
            }
        } else {
            if (g) {
                for(; a < f; a++){
                    c = d.call(b[a], a, b[a]);
                    if (c === false) {
                        break;
                    }
                }
            } else {
                for(a in b){
                    c = d.call(b[a], a, b[a]);
                    if (c === false) {
                        break;
                    }
                }
            }
        }
        return b;
    }
};
