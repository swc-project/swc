_.result = function(object, property) {
    if (null != object) {
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    }
};
