const mod = function() {
    const [a, b, c] = [
        1,
        2,
        3
    ];
    const c1 = c;
    const a1 = a;
    const b1 = b;
    return {
        a: a,
        b: b,
        c: c
    };
}();
export { mod as foo };
