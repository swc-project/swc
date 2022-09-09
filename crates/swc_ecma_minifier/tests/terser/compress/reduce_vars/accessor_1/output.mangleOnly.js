var e = 1;
console.log(
    {
        get a() {
            e = 2;
            return e;
        },
        b: 1,
    }.b,
    e
);
