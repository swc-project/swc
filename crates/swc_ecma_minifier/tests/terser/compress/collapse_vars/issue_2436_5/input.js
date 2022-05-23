var o = { a: 1, b: 2 };
console.log(
    (function (o) {
        return { x: o.a, y: o.b };
    })(o)
);
