function read(input) {
    var i = 0;
    var e = 0;
    var t = 0;
    while (e < 32) {
        var n = input[i++];
        t |= (127 & n) << e;
        if (0 === (128 & n)) return t;
        e += 7;
    }
}
console.log(read([129]));
