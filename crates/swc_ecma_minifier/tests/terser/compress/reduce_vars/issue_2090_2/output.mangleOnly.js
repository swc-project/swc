console.log(
    (function () {
        var o = 1;
        [].forEach(() => {
            o = 2;
        });
        return o;
    })()
);
