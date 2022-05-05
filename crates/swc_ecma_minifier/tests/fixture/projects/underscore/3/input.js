_.max = function (obj, iterator, context) {
    if (
        !iterator &&
        _.isArray(obj) &&
        obj[0] === +obj[0] &&
        obj.length < 65535
    ) {
        return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = { computed: -Infinity, value: -Infinity };
    each(obj, function (value, index, list) {
        var computed = iterator
            ? iterator.call(context, value, index, list)
            : value;
        computed > result.computed &&
            (result = { value: value, computed: computed });
    });
    return result.value;
};
