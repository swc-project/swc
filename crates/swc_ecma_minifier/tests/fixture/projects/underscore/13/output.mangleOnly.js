_.result = function(a, c) {
    if (a == null) return void 0;
    var b = a[c];
    return _.isFunction(b) ? b.call(a) : b;
};
