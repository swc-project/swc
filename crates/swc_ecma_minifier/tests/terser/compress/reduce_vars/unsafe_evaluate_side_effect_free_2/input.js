console.log(
    (function () {
        var o = { p: 1 },
            a = [o];
        console.log(a[0].p);
        return o.p;
    })()
);
