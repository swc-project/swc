(function (o, l) {
    console.log(arguments[0], o, arguments[1], arguments[3], l, arguments[2]);
})("bar", 42, false);
(function (o, l) {
    (() => {
        console.log(
            arguments[0],
            o,
            arguments[1],
            arguments[3],
            l,
            arguments[2]
        );
    })(10, 20, 30, 40);
})("bar", 42, false);
