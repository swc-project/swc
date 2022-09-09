export const E = {
    test: function(e, t, s) {
        s = s || [];
        var f, i, n, r = feature_tests[e], u = r && r[t];
        if (!u) {} else {
            f = u.result;
            if (Y.Lang.isUndefined(f)) {
                i = u.ua;
                if (i) {
                    f = Y.UA[i];
                }
                n = u.test;
                if (n && (!i || f)) {
                    f = n.apply(Y, s);
                }
                u.result = f;
            }
        }
        return f;
    }
};
