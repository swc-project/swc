function c(r, n) {
    let e = new Uint8Array(4 * r * r), o = -.5;
    return {
        e,
        s: Math.sqrt(+1 + o * o),
        c: (r - n) / 2
    };
}
