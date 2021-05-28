var c = "FAIL";
!(function (a, NaN) {
    (function () {
        switch (a) {
            case a:
                break;
            case ((c = "PASS"), NaN):
                break;
        }
    })();
})(NaN);
console.log(c);
