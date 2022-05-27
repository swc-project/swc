export const E = {
    test: function(g, h, d) {
        d = d || [];
        var a, c, e, f = feature_tests[g], b = f && f[h];
        if (!b) {} else {
            a = b.result;
            if (Y.Lang.isUndefined(a)) {
                c = b.ua;
                if (c) {
                    a = Y.UA[c];
                }
                e = b.test;
                if (e && (!c || a)) {
                    a = e.apply(Y, d);
                }
                b.result = a;
            }
        }
        return a;
    }
};
