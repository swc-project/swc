function c(r, n) {
    let e = new Uint8Array(4 * r * r), c = (r - n) / 2;
    return {
        e,
        s: Math.sqrt(1.25),
        c
    };
}
