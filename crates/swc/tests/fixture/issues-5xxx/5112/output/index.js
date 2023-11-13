function c(r, n) {
    return {
        e: new Uint8Array(4 * r * r),
        s: Math.sqrt(1.25),
        c: (r - n) / 2
    };
}
