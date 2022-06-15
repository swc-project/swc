_.result = function(a, b) {
    if (a == null) return void 0;
    var c = a[b];
    return _.isFunction(c) ? c.call(a) : c;
};
