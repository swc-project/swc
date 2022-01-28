var b = 1,
    c = "PASS";
do {
    (function () {
        (function (a) {
            a = 0 != (a && (c = "FAIL"));
        })();
    })();
} while (b--);
console.log(c);
