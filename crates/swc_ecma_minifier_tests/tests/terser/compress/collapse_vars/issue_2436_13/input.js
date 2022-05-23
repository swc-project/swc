var a = "PASS";
(function () {
    function f(b) {
        (function g(b) {
            var b = b && (b.null = "FAIL");
        })(a);
    }
    f();
})();
console.log(a);
