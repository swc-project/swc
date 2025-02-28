function n() {
    var o = [
        94,
        173,
        190,
        239
    ];
    var n = 0;
    n |= o[0];
    n <<= 8;
    n |= o[1];
    n <<= 8;
    n |= o[2];
    n <<= 8;
    n |= o[3];
    return n;
}
console.log(n().toString(16));
