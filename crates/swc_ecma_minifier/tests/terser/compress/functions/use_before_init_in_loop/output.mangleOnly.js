var n = "PASS";
for (var o = 2; --o >= 0; )
    (function () {
        var o = (function () {
            return 1;
        })(o && (n = "FAIL"));
    })();
console.log(n);
