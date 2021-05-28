var c = "PASS";
(function (b) {
    var n = 2;
    while (
        --b +
            (function () {
                e && (c = "FAIL");
                e = 5;
                return 1;
                try {
                    var a = 5;
                } catch (e) {
                    var e;
                }
            })().toString() &&
        --n > 0
    );
})(2);
console.log(c);
