var a = "FAIL";
(function () {
    function f(b) {
        function g(b) {
            b && b();
        }
        g();
        (function () {
            b && (a = "PASS");
        })();
    }
    f("foo");
})();
console.log(a);
