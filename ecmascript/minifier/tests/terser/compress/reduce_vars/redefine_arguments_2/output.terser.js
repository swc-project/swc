console.log(
    (function () {
        var arguments;
        return typeof arguments;
    })(),
    (function () {
        var arguments = 42;
        return typeof arguments;
    })(),
    (function (x) {
        var arguments = x;
        return typeof arguments;
    })()
);
