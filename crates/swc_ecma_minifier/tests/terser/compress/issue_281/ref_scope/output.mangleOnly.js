console.log((function() {
    var n = 1, r = 2, t = 3;
    var n = t++, r = (r /= n);
    return ((function() {
        return n;
    })() + r);
})());
