function a(d) {
    var e = 0;
    var a = 0;
    var b = 0;
    while(a < 32){
        var c = d[e++];
        b = (127 & c) << a;
        if (0 === (128 & c)) return b;
        a += 7;
    }
}
console.log(a([
    129
]));
