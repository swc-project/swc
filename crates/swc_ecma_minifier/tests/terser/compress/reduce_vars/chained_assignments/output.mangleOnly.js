function n() {
    var n = [94, 173, 190, 239];
    var o = 0;
    o |= n[0];
    o <<= 8;
    o |= n[1];
    o <<= 8;
    o |= n[2];
    o <<= 8;
    o |= n[3];
    return o;
}
console.log(n().toString(16));
