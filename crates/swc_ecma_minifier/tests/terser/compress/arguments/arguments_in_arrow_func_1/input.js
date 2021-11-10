(function (a, b) {
    console.log(arguments[0], a, arguments[1], arguments[3], b, arguments[2]);
})("bar", 42, false);
(function (a, b) {
    (() => {
        console.log(
            arguments[0],
            a,
            arguments[1],
            arguments[3],
            b,
            arguments[2]
        );
    })(10, 20, 30, 40);
})("bar", 42, false);
