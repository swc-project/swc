_.indexOf = function(array, item, isSorted) {
    if (null == array) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
        if ("number" != typeof isSorted) return i = _.sortedIndex(array, item), array[i] === item ? i : -1;
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for(; i < length; i++)if (array[i] === item) return i;
    return -1;
};
