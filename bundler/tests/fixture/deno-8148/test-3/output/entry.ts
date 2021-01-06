const mod = function() {
    const [a, b, c] = [
        1,
        2,
        3
    ];
    return {
        a: a,
        b: b,
        c: c
    };
}();
const foo = mod;
export { foo };
