_.result = function(n, r) {
    if (n == null) return void 0;
    var u = n[r];
    return _.isFunction(u) ? u.call(n) : u;
};
