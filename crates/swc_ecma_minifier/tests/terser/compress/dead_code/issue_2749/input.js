var a = 2,
    c = "PASS";
while (a--)
    (function () {
        return b ? (c = "FAIL") : (b = 1);
        try {
        } catch (b) {
            var b;
        }
    })();
console.log(c);
