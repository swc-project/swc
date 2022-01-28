_.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -1 / 0;
    var result = {
        computed: -1 / 0,
        value: -1 / 0
    };
    return each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed > result.computed && (result = {
            value: value,
            computed: computed
        });
    }), result.value;
};
