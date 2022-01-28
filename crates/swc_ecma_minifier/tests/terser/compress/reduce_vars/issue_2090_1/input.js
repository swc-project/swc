console.log(
    (function () {
        var x = 1;
        [].forEach(() => (x = 2));
        return x;
    })()
);
