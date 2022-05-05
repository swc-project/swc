export function log2(v) {
    var r, shift;
    return v >>>= r = (v > 0xffff) << 4, v >>>= shift = (v > 0xff) << 3, r |= shift, shift = (v > 0xf) << 2, v >>>= shift, r |= shift, shift = (v > 0x3) << 1, v >>>= shift, r |= shift, r | v >> 1;
}
