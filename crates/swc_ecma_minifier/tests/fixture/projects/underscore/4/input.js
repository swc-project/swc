_.sample = function (obj, n, guard) {
    if (arguments.length < 2 || guard) {
        return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
};