var o;
console.log(
    (function () {
        this.p++;
    }.call((o = { p: 6 })),
    o.p)
);
