var n = "FAIL";
(function() {
    function o() {
        function o(o) {
            (true << NaN) - 0 / 0 || (n = "PASS");
        }
        o([]);
    }
    o();
})();
console.log(n);
