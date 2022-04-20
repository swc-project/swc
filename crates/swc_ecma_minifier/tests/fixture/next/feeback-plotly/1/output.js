export function log2(v) {
    var r, shift;
    return v >>>= r = (v > 0xFFFF) << 4, v >>>= shift = (v > 0xFF) << 3, r |= shift, shift = (v > 0xF) << 2, v >>>= shift, r |= shift, shift = (v > 0x3) << 1, v >>>= shift, r |= shift, r | v >> 1;
}
