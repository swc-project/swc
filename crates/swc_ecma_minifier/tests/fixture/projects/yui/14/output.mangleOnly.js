YArray.indexOf = Lang._isNative(Native.indexOf) ? function(a, b, c) {
    return Native.indexOf.call(a, b, c);
} : function(b, d, a) {
    var c = b.length;
    a = +a || 0;
    a = (a > 0 || -1) * Math.floor(Math.abs(a));
    if (a < 0) {
        a += c;
        if (a < 0) {
            a = 0;
        }
    }
    for(; a < c; ++a){
        if (a in b && b[a] === d) {
            return a;
        }
    }
    return -1;
};
