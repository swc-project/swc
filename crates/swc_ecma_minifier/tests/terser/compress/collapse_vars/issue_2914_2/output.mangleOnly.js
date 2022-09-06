function r(r) {
    var a = 0;
    var n = 0;
    var o = 0;
    while (n < 32) {
        var v = r[a++];
        o = (127 & v) << n;
        if (0 === (128 & v)) return o;
        n += 7;
    }
}
console.log(r([129]));
