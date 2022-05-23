var c = "FAIL";
!(function (a) {
    if (
        ((function (a) {
            a && a();
        })(),
        a)
    )
        c = "PASS";
})(1),
    console.log(c);
