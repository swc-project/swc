_.invoke = function(obj, method) {
    var args = slice.call(arguments, 2), isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
        return (isFunc ? method : value[method]).apply(value, args);
    });
};
