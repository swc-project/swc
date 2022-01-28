var a, c;
console.log(
    (function (undefined) {
        return function () {
            if (a) return b;
            if (c) return d;
        };
    })()()
);
