var n = "FAIL";
(function () {
    function o(o) {
        function c(n) {
            n && n();
        }
        c();
        (function () {
            o && (n = "PASS");
        })();
    }
    o("foo");
})();
console.log(n);
