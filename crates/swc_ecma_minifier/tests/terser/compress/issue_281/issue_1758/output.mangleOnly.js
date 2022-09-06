console.log(
    (function (n) {
        var o = 42;
        return (function () {
            n--;
            n--, n.toString();
            return;
        })();
    })()
);
