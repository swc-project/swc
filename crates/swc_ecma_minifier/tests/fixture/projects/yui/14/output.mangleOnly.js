YArray.indexOf = Lang._isNative(Native.indexOf) ? function(i, n, r) {
    return Native.indexOf.call(i, n, r);
} : function(i, n, r) {
    var t = i.length;
    r = +r || 0;
    r = (r > 0 || -1) * Math.floor(Math.abs(r));
    if (r < 0) {
        r += t;
        if (r < 0) {
            r = 0;
        }
    }
    for(; r < t; ++r){
        if (r in i && i[r] === n) {
            return r;
        }
    }
    return -1;
};
