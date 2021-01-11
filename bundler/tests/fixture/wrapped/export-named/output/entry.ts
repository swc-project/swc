const [a, b, c] = [
    1,
    2,
    3
];
const b1 = b;
const mod = function() {
    const b2 = b1;
    return {
        b: b2
    };
}();
const foo = mod;
console.log(foo);
