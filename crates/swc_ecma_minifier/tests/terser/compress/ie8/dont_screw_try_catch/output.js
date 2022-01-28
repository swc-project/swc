bad = function (n) {
    return function (t) {
        try {
            n();
        } catch (n) {
            t(n);
        }
    };
};
