export function foo(o) {
    let t, e = 1;
    return o && (e = 2), [
        e,
        (t = 1, o && (t = 2), t)
    ];
}
