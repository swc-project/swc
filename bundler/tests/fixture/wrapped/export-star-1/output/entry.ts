const [a, b, c] = [
    1,
    2,
    3
];
const c1 = c;
const a1 = a;
const b1 = b;
const mod = function() {
    return {
        a: a1,
        b: b1,
        c: c1
    };
}();
const foo = mod;
console.log(foo);
