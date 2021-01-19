console.log(
    (function (x) {
        var a = {},
            b = (a.b = 1);
        return a.b + b;
    })()
);
