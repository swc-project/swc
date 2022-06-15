export const E = {
    test: function(a, b, c) {
        c = c || [];
        var d, e, f, g = feature_tests[a], h = g && g[b];
        if (!h) {} else {
            d = h.result;
            if (Y.Lang.isUndefined(d)) {
                e = h.ua;
                if (e) {
                    d = Y.UA[e];
                }
                f = h.test;
                if (f && (!e || d)) {
                    d = f.apply(Y, c);
                }
                h.result = d;
            }
        }
        return d;
    }
};
