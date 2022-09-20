export const E = {
    test: function(cat, name, args) {
        args = args || [];
        var result, ua, test, cat_o = feature_tests[cat], feature = cat_o && cat_o[name];
        if (feature) {
            result = feature.result;
            if (Y.Lang.isUndefined(result)) {
                (ua = feature.ua) && (result = Y.UA[ua]);
                (test = feature.test) && (!ua || result) && (result = test.apply(Y, args));
                feature.result = result;
            }
        }
        return result;
    }
};
