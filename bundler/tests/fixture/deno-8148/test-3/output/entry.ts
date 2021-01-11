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
        a: a1,
        b: b1,
        c: c1
    };
}();
const foo = mod;
export { foo };
