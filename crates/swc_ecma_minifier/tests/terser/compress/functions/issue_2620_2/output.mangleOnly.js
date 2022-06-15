var a = "FAIL";
(function() {
    function b(b) {
        var c = (function a(b) {
            b && b();
        })();
        if (b) {
            var d = (a = "PASS");
        }
    }
    b(1);
})();
console.log(a);
