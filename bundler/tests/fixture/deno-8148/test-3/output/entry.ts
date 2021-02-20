const [a, b, c] = [
    1,
    2,
    3
];
const mod = function() {
    return {
        a,
        b,
        c
    };
}();
export { mod as foo };
