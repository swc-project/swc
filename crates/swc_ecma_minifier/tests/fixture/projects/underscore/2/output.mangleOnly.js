_.invoke = function(n, r) {
    var a = slice.call(arguments, 2);
    var i = _.isFunction(r);
    return _.map(n, function(n) {
        return (i ? r : n[r]).apply(n, a);
    });
};
