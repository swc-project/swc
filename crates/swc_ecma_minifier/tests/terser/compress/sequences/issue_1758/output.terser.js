console.log(
    (function (c) {
        var undefined = 42;
        return (function () {
            return c--, c--, void c.toString();
        })();
    })()
);
