export function bitwise1(a, b) {
    return (a & b) | 0;
}

export function bitwise2(a) {
    return ~a | 0;
}

export function bitwise3(a, b) {
    a ^= b | 0;

    console.log(a | b, a & b);
}
