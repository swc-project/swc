console.log(
    (function (c) {
        var undefined = 42;
        return c--, c--, void c.toString();
    })()
);
