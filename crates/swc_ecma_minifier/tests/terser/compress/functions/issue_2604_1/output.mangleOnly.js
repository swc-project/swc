var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (b) {
        (function a(b) {
            b && b();
        })();
        b && (a = "PASS");
    }
})();
console.log(a);
