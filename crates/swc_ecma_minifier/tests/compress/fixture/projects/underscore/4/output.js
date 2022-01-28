_.sample = function(obj, n, guard) {
    return arguments.length < 2 || guard ? obj[_.random(obj.length - 1)] : _.shuffle(obj).slice(0, Math.max(0, n));
};
