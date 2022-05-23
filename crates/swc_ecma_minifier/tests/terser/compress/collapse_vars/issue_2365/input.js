console.log(
    (function (a) {
        var b = a.f;
        a.f++;
        return b;
    })({ f: 1 })
);
console.log(
    (function () {
        var a = { f: 1 },
            b = a.f;
        a.f++;
        return b;
    })()
);
console.log(
    {
        f: 1,
        g: function () {
            var b = this.f;
            this.f++;
            return b;
        },
    }.g()
);
