_.shuffle = function(n) {
    var r;
    var a = 0;
    var f = [];
    each(n, function(n) {
        r = _.random(a++);
        f[a - 1] = f[r];
        f[r] = n;
    });
    return f;
};
