console.log(
    (function (f) {
        var n = f.f;
        f.f++;
        return n;
    })({ f: 1 })
);
console.log(
    (function () {
        var f = { f: 1 },
            n = f.f;
        f.f++;
        return n;
    })()
);
console.log(
    {
        f: 1,
        g: function () {
            var f = this.f;
            this.f++;
            return f;
        },
    }.g()
);
