export const obj = {
    inArray: function(a, b, c) {
        var d;
        if (b) {
            if (core_indexOf) {
                return core_indexOf.call(b, a, c);
            }
            d = b.length;
            c = c ? (c < 0 ? Math.max(0, d + c) : c) : 0;
            for(; c < d; c++){
                if (c in b && b[c] === a) {
                    return c;
                }
            }
        }
        return -1;
    }
};
