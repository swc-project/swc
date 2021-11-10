console.log(
    (function () {
        var x = { a: 1, c: (console.log("c"), "C") };
        x.b = 2;
        (x[3] = function () {
            console.log(x);
        }),
            (x["a"] = /foo/),
            (x.bar = x);
        return x;
    })()
);
