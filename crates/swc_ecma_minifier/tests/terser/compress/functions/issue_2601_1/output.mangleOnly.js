var n = "FAIL";
(function() {
    function n(n) {
        function o(n) {
            n && n();
        }
        o();
        (function() {
            n && (n = "PASS");
        })();
    }
    n("foo");
})();
console.log(n);
