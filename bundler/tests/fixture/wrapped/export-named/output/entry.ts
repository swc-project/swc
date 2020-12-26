const [a, b, c] = [
    1,
    2,
    3
];
const b1 = b;
const b2 = b1;
const mod = function() {
    return {
        b: b1
    };
}();
const foo = mod;
console.log(foo);
