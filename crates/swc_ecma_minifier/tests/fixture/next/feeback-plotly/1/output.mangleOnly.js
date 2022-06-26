export function log2(a) {
    var b, c;
    b = (a > 0xffff) << 4;
    a >>>= b;
    c = (a > 0xff) << 3;
    a >>>= c;
    b |= c;
    c = (a > 0xf) << 2;
    a >>>= c;
    b |= c;
    c = (a > 0x3) << 1;
    a >>>= c;
    b |= c;
    return b | (a >> 1);
}
