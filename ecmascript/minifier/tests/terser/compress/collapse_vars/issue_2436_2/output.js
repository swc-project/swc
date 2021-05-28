var o = { a: 1, b: 2 };
console.log(
    (function (c) {
        o.a = 3;
        return { x: c.a, y: c.b };
    })(o)
);
