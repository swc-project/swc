_.random = function(n, o) {
    if (o == null) {
        o = n;
        n = 0;
    }
    return n + Math.floor(Math.random() * (o - n + 1));
};
