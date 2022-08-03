export const obj = {
    inArray: function(r, n, t) {
        var i;
        if (n) {
            if (core_indexOf) {
                return core_indexOf.call(n, r, t);
            }
            i = n.length;
            t = t ? (t < 0 ? Math.max(0, i + t) : t) : 0;
            for(; t < i; t++){
                if (t in n && n[t] === r) {
                    return t;
                }
            }
        }
        return -1;
    }
};
