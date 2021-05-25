console.log(
    (function () {
        var x = {
            a: (1, /foo/),
            c: (console.log("c"), "C"),
            b: 2,
            3: function () {
                console.log(x);
            },
        };
        x.bar = x;
        return x;
    })()
);
