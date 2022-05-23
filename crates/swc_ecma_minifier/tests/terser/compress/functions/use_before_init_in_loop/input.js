var a = "PASS";
for (var b = 2; --b >= 0; )
    (function () {
        var c = (function () {
            return 1;
        })(c && (a = "FAIL"));
    })();
console.log(a);
