function r(a) {
    var n = 0;
    var r = 0;
    var o = 0;
    while(r < 32){
        var v = a[n++];
        o = (127 & v) << r;
        if (0 === (128 & v)) return o;
        r += 7;
    }
}
console.log(r([
    129
]));
