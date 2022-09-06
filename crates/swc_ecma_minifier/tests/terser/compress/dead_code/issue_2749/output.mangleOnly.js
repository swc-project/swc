var r = 2,
    c = "PASS";
while (r--)
    (function () {
        return r ? (c = "FAIL") : (r = 1);
        try {
        } catch (r) {
            var r;
        }
    })();
console.log(c);
