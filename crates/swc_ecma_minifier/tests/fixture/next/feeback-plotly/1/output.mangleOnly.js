export function log2(a) {
    var c, b;
    c = (a > 0xffff) << 4;
    a >>>= c;
    b = (a > 0xff) << 3;
    a >>>= b;
    c |= b;
    b = (a > 0xf) << 2;
    a >>>= b;
    c |= b;
    b = (a > 0x3) << 1;
    a >>>= b;
    c |= b;
    return c | (a >> 1);
}
