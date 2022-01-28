var a = "FAIL";
(function () {
    var b;
    (b = "foo"),
        (function (b) {
            b && b();
        })(),
        b && (a = "PASS");
})(),
    console.log(a);
