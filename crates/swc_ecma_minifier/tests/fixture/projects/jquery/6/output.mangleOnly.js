export const obj = {
    inArray: function(r, n, e) {
        var i;
        if (n) {
            if (core_indexOf) {
                return core_indexOf.call(n, r, e);
            }
            i = n.length;
            e = e ? (e < 0 ? Math.max(0, i + e) : e) : 0;
            for(; e < i; e++){
                if (e in n && n[e] === r) {
                    return e;
                }
            }
        }
        return -1;
    }
};
