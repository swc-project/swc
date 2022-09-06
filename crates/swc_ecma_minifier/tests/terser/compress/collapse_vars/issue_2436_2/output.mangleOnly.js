var a = { a: 1, b: 2 };
console.log(
    (function (n) {
        a.a = 3;
        return { x: n.a, y: n.b };
    })(a)
);
