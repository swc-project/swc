console.log(
    (function () {
        for (var o = { p: 3, q: "foo" }; console.log(o.q); );
        return o.p;
    })()
);
