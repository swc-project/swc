console.log(
    (function () {
        var o = { p: 1 },
            n = [o];
        console.log(n[0].p);
        return o.p;
    })()
);
