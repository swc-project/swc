console.log((function() {
    var r = 1, n = 2, o = 3;
    var r = o++, n = (n /= r);
    return ((function() {
        return r;
    })() + n);
})());
