var a = "FAIL";
(function() {
    function b() {
        function b(b) {
            (true << NaN) - 0 / 0 || (a = "PASS");
        }
        b([]);
    }
    b();
})();
console.log(a);
