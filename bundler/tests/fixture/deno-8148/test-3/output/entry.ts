const mod = function() {
    const [a, b, c] = [
        1,
        2,
        3
    ];
    const a1 = a, b1 = b, c1 = c;
    return {
        a,
        b,
        c
    };
}();
const foo = mod;
export { foo };
