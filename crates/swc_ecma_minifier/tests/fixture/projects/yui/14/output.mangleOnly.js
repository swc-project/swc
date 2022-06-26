YArray.indexOf = Lang._isNative(Native.indexOf) ? function(a, b, c) {
    return Native.indexOf.call(a, b, c);
} : function(a, b, c) {
    var d = a.length;
    c = +c || 0;
    c = (c > 0 || -1) * Math.floor(Math.abs(c));
    if (c < 0) {
        c += d;
        if (c < 0) {
            c = 0;
        }
    }
    for(; c < d; ++c){
        if (c in a && a[c] === b) {
            return c;
        }
    }
    return -1;
};
