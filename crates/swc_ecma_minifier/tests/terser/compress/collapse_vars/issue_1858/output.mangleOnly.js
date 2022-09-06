console.log(
    (function (n) {
        var o = {},
            r = (o.b = n);
        return o.b + r;
    })(1)
);
