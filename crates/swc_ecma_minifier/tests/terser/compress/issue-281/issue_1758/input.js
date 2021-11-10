console.log(
    (function (c) {
        var undefined = 42;
        return (function () {
            c--;
            c--, c.toString();
            return;
        })();
    })()
);
