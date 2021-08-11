console.log(
    (function () {
        var o = { p: 1 };
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        console.log(o.p);
        return o;
    })()
);
console.log(
    (function () {
        var o = { p: 3 };
        console.log([o][0].p);
        return o.p;
    })()
);
