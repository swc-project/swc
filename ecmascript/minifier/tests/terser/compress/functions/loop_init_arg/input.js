var a = "PASS";
for (var k in "12")
    (function (b) {
        (b >>= 1) && (a = "FAIL"), (b = 2);
    })();
console.log(a);
