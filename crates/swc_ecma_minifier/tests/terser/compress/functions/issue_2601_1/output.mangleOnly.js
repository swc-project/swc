var n = "FAIL";
(function() {
    function o(c) {
        function o(n) {
            n && n();
        }
        o();
        (function() {
            c && (n = "PASS");
        })();
    }
    o("foo");
})();
console.log(n);
