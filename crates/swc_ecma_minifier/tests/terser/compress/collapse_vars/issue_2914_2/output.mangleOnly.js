function r(r) {
    var a = 0;
    var v = 0;
    var $ = 0;
    while(v < 32){
        var i = r[a++];
        $ = (127 & i) << v;
        if (0 === (128 & i)) return $;
        v += 7;
    }
}
console.log(r([
    129
]));
