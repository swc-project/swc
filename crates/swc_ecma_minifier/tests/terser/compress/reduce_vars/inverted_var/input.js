console.log(
    (function () {
        var a = 1;
        return a;
    })(),
    (function () {
        var b;
        b = 2;
        return b;
    })(),
    (function () {
        c = 3;
        return c;
        var c;
    })(),
    (function (c) {
        c = 4;
        return c;
    })(),
    (function (c) {
        c = 5;
        return c;
        var c;
    })(),
    (function c() {
        c = 6;
        return c;
    })(),
    (function c() {
        c = 7;
        return c;
        var c;
    })(),
    (function () {
        c = 8;
        return c;
        var c = "foo";
    })()
);
