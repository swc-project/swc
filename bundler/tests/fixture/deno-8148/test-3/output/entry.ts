const [a, b, c] = [
    1,
    2,
    3
];
const mod = function() {
    return {
        a: a,
        b: b,
        c: c
    };
}();
export { mod as foo };
