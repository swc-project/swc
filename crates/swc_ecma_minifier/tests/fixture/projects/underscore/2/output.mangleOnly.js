_.invoke = function(n, i) {
    var r = slice.call(arguments, 2);
    var a = _.isFunction(i);
    return _.map(n, function(n) {
        return (a ? i : n[i]).apply(n, r);
    });
};
