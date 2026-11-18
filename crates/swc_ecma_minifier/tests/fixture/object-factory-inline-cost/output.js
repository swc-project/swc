function node(t, i, s, c, m, p, e, a, f, b, o, l) {
    return {
        t,
        i,
        s,
        c,
        m,
        p,
        e,
        a,
        f,
        b,
        o,
        l
    };
}
export function array(i, a) {
    return node(9, i, void 0, void 0, void 0, void 0, void 0, a);
}
export function boxed(i, f) {
    return node(21, i, void 0, void 0, void 0, void 0, void 0, void 0, f);
}
export function temporal(i, c, s) {
    return node(36, i, s, c);
}
