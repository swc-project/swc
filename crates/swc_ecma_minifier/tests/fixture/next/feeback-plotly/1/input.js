export function log2(v) {
    var r, shift;
    r = (v > 0xFFFF) << 4; v >>>= r;
    shift = (v > 0xFF) << 3; v >>>= shift; r |= shift;
    shift = (v > 0xF) << 2; v >>>= shift; r |= shift;
    shift = (v > 0x3) << 1; v >>>= shift; r |= shift;
    return r | (v >> 1);
}