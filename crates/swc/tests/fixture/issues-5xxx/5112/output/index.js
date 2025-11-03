function c(r, n) {
    let e;
    return {
        e: new Uint8Array(4 * r * r),
        s: 1.118033988749895,
        c: (r - n) / 2
    };
}
