export const obj = {
    inArray: function(d, b, a) {
        var c;
        if (b) {
            if (core_indexOf) {
                return core_indexOf.call(b, d, a);
            }
            c = b.length;
            a = a ? (a < 0 ? Math.max(0, c + a) : a) : 0;
            for(; a < c; a++){
                if (a in b && b[a] === d) {
                    return a;
                }
            }
        }
        return -1;
    }
};
