function r() {
    var r = [
        94,
        173,
        190,
        239
    ];
    var n = 0;
    n |= r[0];
    n <<= 8;
    n |= r[1];
    n <<= 8;
    n |= r[2];
    n <<= 8;
    n |= r[3];
    return n;
}
console.log(r().toString(16));
