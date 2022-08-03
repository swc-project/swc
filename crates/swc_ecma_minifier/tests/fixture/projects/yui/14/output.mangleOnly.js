YArray.indexOf = Lang._isNative(Native.indexOf) ? function(n, i, f) {
    return Native.indexOf.call(n, i, f);
} : function(n, i, f) {
    var r = n.length;
    f = +f || 0;
    f = (f > 0 || -1) * Math.floor(Math.abs(f));
    if (f < 0) {
        f += r;
        if (f < 0) {
            f = 0;
        }
    }
    for(; f < r; ++f){
        if (f in n && n[f] === i) {
            return f;
        }
    }
    return -1;
};
