function node(t, i, s, c, m, p, e, a, f, b, o, l) {
    return { t, i, s, c, m, p, e, a, f, b, o, l };
}

export function array(id, values) {
    return node(9, id, undefined, undefined, undefined, undefined, undefined, values);
}
