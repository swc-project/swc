_.shuffle = function(a) {
    var c;
    var d = 0;
    var b = [];
    each(a, function(a) {
        c = _.random(d++);
        b[d - 1] = b[c];
        b[c] = a;
    });
    return b;
};
