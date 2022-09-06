var o = "PASS";
for (var n in "12")
    (function (n) {
        (n >>= 1) && (o = "FAIL"), (n = 2);
    })();
console.log(o);
