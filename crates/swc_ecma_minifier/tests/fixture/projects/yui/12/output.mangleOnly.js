export const E = {
    test: function(e, t, i) {
        i = i || [];
        var n, s, f, r = feature_tests[e], u = r && r[t];
        if (!u) {} else {
            n = u.result;
            if (Y.Lang.isUndefined(n)) {
                s = u.ua;
                if (s) {
                    n = Y.UA[s];
                }
                f = u.test;
                if (f && (!s || n)) {
                    n = f.apply(Y, i);
                }
                u.result = n;
            }
        }
        return n;
    }
};
