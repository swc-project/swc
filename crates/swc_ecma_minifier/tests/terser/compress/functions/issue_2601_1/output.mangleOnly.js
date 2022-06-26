var a = "FAIL";
(function() {
    function b(b) {
        function c(a) {
            a && a();
        }
        c();
        (function() {
            b && (a = "PASS");
        })();
    }
    b("foo");
})();
console.log(a);
