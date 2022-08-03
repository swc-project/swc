export const obj = {
    each: function(e, f, a) {
        var l, r = 0, i = e.length, o = isArraylike(e);
        if (a) {
            if (o) {
                for(; r < i; r++){
                    l = f.apply(e[r], a);
                    if (l === false) {
                        break;
                    }
                }
            } else {
                for(r in e){
                    l = f.apply(e[r], a);
                    if (l === false) {
                        break;
                    }
                }
            }
        } else {
            if (o) {
                for(; r < i; r++){
                    l = f.call(e[r], r, e[r]);
                    if (l === false) {
                        break;
                    }
                }
            } else {
                for(r in e){
                    l = f.call(e[r], r, e[r]);
                    if (l === false) {
                        break;
                    }
                }
            }
        }
        return e;
    }
};
