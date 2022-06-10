_.random = function(a, b) {
    if (b == null) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a + 1));
};
