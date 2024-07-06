YArray.indexOf = Lang._isNative(Native.indexOf) ? function(array, value, from) {
    return Native.indexOf.call(array, value, from);
} : function(array, value, from) {
    // http://es5.github.com/#x15.4.4.14
    var len = array.length;
    for((from = ((from = +from || 0) > 0 || -1) * Math.floor(Math.abs(from))) < 0 && (from += len) < 0 && (from = 0); from < len; ++from)if (from in array && array[from] === value) return from;
    return -1;
};
