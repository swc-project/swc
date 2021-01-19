console.log(
    (function () {
        var o = { p: 3 };
        for (o.q = "foo"; console.log(o.q); );
        return o.p;
    })()
);
