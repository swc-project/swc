var n = "FAIL";
(function() {
    function o(o) {
        function f(n) {
            n && n();
        }
        f();
        (function() {
            o && (n = "PASS");
        })();
    }
    o("foo");
})();
console.log(n);
