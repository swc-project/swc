_.indexOf = function(array, item, isSorted) {
    if (null == array) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
        if ('number' == typeof isSorted) i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
        else return array[i = _.sortedIndex(array, item)] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for(; i < length; i++)if (array[i] === item) return i;
    return -1;
};
