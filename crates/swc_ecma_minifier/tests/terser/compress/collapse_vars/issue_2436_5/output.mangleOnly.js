var n = { a: 1, b: 2 };
console.log(
    (function (n) {
        return { x: n.a, y: n.b };
    })(n)
);
