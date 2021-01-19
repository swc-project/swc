console.log(
    (function () {
        var x = 1;
        return x;
    })(),
    (function () {
        const y = 2;
        return y;
    })(),
    (function () {
        function z() {}
        return z;
    })()
);
