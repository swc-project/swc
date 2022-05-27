good = function(a) {
    return function(b) {
        try {
            a();
        } catch (c) {
            b(c);
        }
    };
};
