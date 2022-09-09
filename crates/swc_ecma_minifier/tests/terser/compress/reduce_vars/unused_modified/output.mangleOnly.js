console.log(
    (function () {
        var n = 1,
            o = "FAIL";
        if (0 || n--) o = "PASS";
        n = 1;
        return o;
    })()
);
