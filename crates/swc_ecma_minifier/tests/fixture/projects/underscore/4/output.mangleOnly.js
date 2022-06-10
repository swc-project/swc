_.sample = function(a, b, c) {
    if (arguments.length < 2 || c) {
        return a[_.random(a.length - 1)];
    }
    return _.shuffle(a).slice(0, Math.max(0, b));
};
