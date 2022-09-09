var o = 1,
    n = "PASS";
do {
    (function () {
        (function (o) {
            o = 0 != (o && (n = "FAIL"));
        })();
    })();
} while (o--);
console.log(n);
