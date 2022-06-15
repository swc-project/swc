_.shuffle = function(a) {
    var b;
    var c = 0;
    var d = [];
    each(a, function(a) {
        b = _.random(c++);
        d[c - 1] = d[b];
        d[b] = a;
    });
    return d;
};
