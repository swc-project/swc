function c(r, n) {
    let e = new Uint8Array(4 * r * r);
    return {
        e,
        s: Math.sqrt(1 + -(-0.5 * 0.5)),
        c: (r - n) / 2
    };
}
