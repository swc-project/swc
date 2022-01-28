console.log(
    (function () {
        var o = { p: 1 };
        console.log(o.not_present);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        console.log(o.prototype);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 3 };
        console.log(o.hasOwnProperty);
        return o.p;
    })()
);
