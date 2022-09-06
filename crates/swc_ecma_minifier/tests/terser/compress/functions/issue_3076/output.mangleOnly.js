var r = "PASS";
(function (n) {
    var t = 2;
    while (
        --n +
            (function () {
                t && (r = "FAIL");
                t = 5;
                return 1;
                try {
                    var n = 5;
                } catch (t) {
                    var t;
                }
            })().toString() &&
        --t > 0
    );
})(2);
console.log(r);
