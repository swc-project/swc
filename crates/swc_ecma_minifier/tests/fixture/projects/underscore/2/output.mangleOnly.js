_.invoke = function(a, b) {
    var c = slice.call(arguments, 2);
    var d = _.isFunction(b);
    return _.map(a, function(a) {
        return (d ? b : a[b]).apply(a, c);
    });
};
