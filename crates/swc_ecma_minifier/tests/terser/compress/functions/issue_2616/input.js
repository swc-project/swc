var c = "FAIL";
(function () {
    function f() {
        function g(NaN) {
            (true << NaN) - 0 / 0 || (c = "PASS");
        }
        g([]);
    }
    f();
})();
console.log(c);
