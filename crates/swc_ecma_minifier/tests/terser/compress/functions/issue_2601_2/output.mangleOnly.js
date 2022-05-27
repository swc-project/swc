var a = "FAIL";
(function() {
    function b(c) {
        function b(a) {
            a && a();
        }
        b();
        (function() {
            c && (a = "PASS");
        })();
    }
    b("foo");
})();
console.log(a);
