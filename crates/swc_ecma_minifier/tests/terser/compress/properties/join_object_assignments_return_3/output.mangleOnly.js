console.log(
    (function () {
        var o = { p: 3 };
        return (o.q = "foo"), (o.p += ""), console.log(o.q), o.p;
    })()
);
