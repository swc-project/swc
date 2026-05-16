function c(r, n) {
    let e = new Uint8Array(4 * r * r), s = void 0;
    return {
        e,
        s: Math.sqrt(1.25),
        c: (r - n) / 2
    };
}
