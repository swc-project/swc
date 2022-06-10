console.log((function() {
    var b = 1, a = 2, c = 3;
    var b = c++, a = (a /= b);
    return ((function() {
        return b;
    })() + a);
})());
