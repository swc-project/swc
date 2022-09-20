_.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
        context = iterator;
        iterator = isSorted;
        isSorted = !1;
    }
    var initial = iterator ? _.map(array, iterator, context) : array, results = [], seen = [];
    return each(initial, function(value, index) {
        if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
            seen.push(value);
            results.push(array[index]);
        }
    }), results;
};
