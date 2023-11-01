var n = "FAIL";
(function() {
    function o() {
        function o(NaN) {
            (true << NaN) - 0 / 0 || (n = "PASS");
        }
        o([]);
    }
    o();
})();
console.log(n);
