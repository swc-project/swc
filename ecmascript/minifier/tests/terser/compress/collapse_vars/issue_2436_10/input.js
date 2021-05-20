var o = { a: 1, b: 2 };
function f(n) {
    o = { b: 3 };
    return n;
}
console.log(
    (function (c) {
        return [c.a, f(c.b), c.b];
    })(o).join(" ")
);
