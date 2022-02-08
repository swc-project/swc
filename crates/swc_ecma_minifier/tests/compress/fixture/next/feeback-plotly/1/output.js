export function log2(v) {
    var r, shift;
    return v >>>= shift = ((v >>>= r = (v > 65535) << 4) > 255) << 3, r |= shift, shift = (v > 15) << 2, v >>>= shift, r |= shift, shift = (v > 3) << 1, v >>>= shift, r |= shift, r | v >> 1;
}
