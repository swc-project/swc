_.sortedIndex = function(array, obj, iterator, context) {
    for(var value = (iterator = null == iterator ? _.identity : lookupIterator(iterator)).call(context, obj), low = 0, high = array.length; low < high;){
        var mid = low + high >>> 1;
        iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
};
