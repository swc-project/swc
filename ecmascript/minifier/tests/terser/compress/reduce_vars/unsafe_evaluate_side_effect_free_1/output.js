console.log(
    (function () {
        console.log(1);
        return 1;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        console.log(2);
        return o;
    })()
);
console.log(
    (function () {
        console.log(3);
        return 3;
    })()
);
