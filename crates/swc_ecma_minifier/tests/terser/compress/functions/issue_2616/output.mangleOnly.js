var n = "FAIL";
(function () {
    function o() {
        function o(o) {
            (true << o) - 0 / 0 || (n = "PASS");
        }
        o([]);
    }
    o();
})();
console.log(n);
