export function log2(r) {
    var n, o;
    n = (r > 0xffff) << 4;
    r >>>= n;
    o = (r > 0xff) << 3;
    r >>>= o;
    n |= o;
    o = (r > 0xf) << 2;
    r >>>= o;
    n |= o;
    o = (r > 0x3) << 1;
    r >>>= o;
    n |= o;
    return n | (r >> 1);
}
