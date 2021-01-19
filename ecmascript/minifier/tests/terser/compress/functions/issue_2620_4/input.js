var c = "FAIL";
(function () {
    function f(a, NaN) {
        function g() {
            switch (a) {
                case a:
                    break;
                case ((c = "PASS"), NaN):
                    break;
            }
        }
        g();
    }
    f(0 / 0);
})();
console.log(c);
