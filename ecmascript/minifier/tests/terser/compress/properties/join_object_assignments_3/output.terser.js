console.log(
    (function () {
        var o = { a: "PASS" },
            a = o.a;
        o.a = "FAIL";
        return a;
    })()
);
