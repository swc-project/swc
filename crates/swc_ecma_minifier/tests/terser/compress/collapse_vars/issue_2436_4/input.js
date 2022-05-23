var o = { a: 1, b: 2 };
console.log(
    (function (c) {
        return { x: c.a, y: c.b };
        var o;
    })(o)
);
