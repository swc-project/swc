const mod = function() {
    const [a, b, c] = [
        1,
        2,
        3
    ];
    const a1 = a;
    const b1 = b;
    const c1 = c;
    return {
        a: a,
        b: b,
        c: c
    };
}();
const foo = mod;
export { mod as foo };
