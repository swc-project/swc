console.log(
    (function () {
        var a = 1,
            b = 2,
            c = 3;
        b = b /= a = c++;
        return a + b;
    })()
);
