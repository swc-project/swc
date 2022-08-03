export function log2(f) {
    var x, r;
    x = (f > 0xffff) << 4;
    f >>>= x;
    r = (f > 0xff) << 3;
    f >>>= r;
    x |= r;
    r = (f > 0xf) << 2;
    f >>>= r;
    x |= r;
    r = (f > 0x3) << 1;
    f >>>= r;
    x |= r;
    return x | (f >> 1);
}
