export function bitwise1(a, b) {
    return a & b;
}
export function bitwise2(a) {
    return ~a;
}
export function bitwise3(a, b) {
    console.log((a ^= b) | b, a & b);
}
