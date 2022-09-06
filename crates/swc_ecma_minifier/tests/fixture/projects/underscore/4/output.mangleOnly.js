_.sample = function(e, n, t) {
    if (arguments.length < 2 || t) {
        return e[_.random(e.length - 1)];
    }
    return _.shuffle(e).slice(0, Math.max(0, n));
};
