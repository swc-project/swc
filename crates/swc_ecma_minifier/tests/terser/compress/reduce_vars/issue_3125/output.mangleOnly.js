var l;
console.log(
    (function () {
        this.p++;
    }.call((l = { p: 6 })),
    l.p)
);
