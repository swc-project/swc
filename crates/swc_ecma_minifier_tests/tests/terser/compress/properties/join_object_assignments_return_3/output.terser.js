console.log(
    (function () {
        var o = { p: 3, q: "foo" };
        return (o.p += ""), console.log(o.q), o.p;
    })()
);
