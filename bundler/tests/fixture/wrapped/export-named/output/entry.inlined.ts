const [a, b, c] = [
    1,
    2,
    3
];
const mod = function() {
    const b1 = b;
    return {
        b: b
    };
}();
console.log(mod);
