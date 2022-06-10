var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (b) {
        (function b(a) {
            a && a();
        })();
        b && (a = "PASS");
    }
})();
console.log(a);
