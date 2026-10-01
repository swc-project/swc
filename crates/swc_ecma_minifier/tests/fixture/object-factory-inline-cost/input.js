function node(t, i, s, c, m, p, e, a, f, b, o, l) {
    return { t, i, s, c, m, p, e, a, f, b, o, l };
}

export function array(i, a) {
    return node(9, i, undefined, undefined, undefined, undefined, undefined, a);
}

export function boxed(i, f) {
    return node(21, i, undefined, undefined, undefined, undefined, undefined, undefined, f);
}

export function temporal(i, c, s) {
    return node(36, i, s, c);
}
