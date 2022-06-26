function a(a) {
    var b = 0;
    var c = 0;
    var d = 0;
    while(c < 32){
        var e = a[b++];
        d = (127 & e) << c;
        if (0 === (128 & e)) return d;
        c += 7;
    }
}
console.log(a([
    129
]));
