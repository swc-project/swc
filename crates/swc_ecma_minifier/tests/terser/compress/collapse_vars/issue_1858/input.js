console.log(
    (function (x) {
        var a = {},
            b = (a.b = x);
        return a.b + b;
    })(1)
);
