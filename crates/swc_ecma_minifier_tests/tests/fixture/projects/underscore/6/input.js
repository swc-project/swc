_.indexOf = function (array, item, isSorted) {
    if (array == null) return -1;
    var i = 0,
        length = array.length;
    if (isSorted) {
        if (typeof isSorted == "number") {
            i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
        } else {
            i = _.sortedIndex(array, item);
            return array[i] === item ? i : -1;
        }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf)
        return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
};
