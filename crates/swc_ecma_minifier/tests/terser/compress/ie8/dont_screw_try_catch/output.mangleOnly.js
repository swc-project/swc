bad = function(n) {
    return function(t) {
        try {
            n();
        } catch (c) {
            t(c);
        }
    };
};
