console.log(
    (function () {
        var n = 1,
            r = 2,
            o = 3;
        var n = o++,
            r = (r /= n);
        return (
            (function () {
                return n;
            })() + r
        );
    })()
);
