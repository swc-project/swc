var a = { a: 1, b: 2 };
console.log(
    (function (n) {
        a = { a: 3, b: 4 };
        return { x: n.a, y: n.b };
    })(a)
);
