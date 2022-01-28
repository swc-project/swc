var c = "FAIL";
(function () {
    function f(a) {
        var b = (function g(a) {
            a && a();
        })();
        if (a) {
            var d = (c = "PASS");
        }
    }
    f(1);
})();
console.log(c);
