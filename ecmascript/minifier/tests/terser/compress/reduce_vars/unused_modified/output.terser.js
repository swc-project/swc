console.log(
    (function () {
        var b = 1,
            c = "FAIL";
        if (0 || b--) c = "PASS";
        b = 1;
        return c;
    })()
);
