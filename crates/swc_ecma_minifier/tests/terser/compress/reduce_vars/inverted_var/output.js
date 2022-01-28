console.log(
    1,
    2,
    3,
    4,
    5,
    (function c() {
        c = 6;
        return c;
    })(),
    7,
    (function () {
        c = 8;
        return c;
        var c = "foo";
    })()
);
