var a = "FAIL";
(function () {
    try {
        throw 1;
    } catch (b) {
        (function (b) {
            b && b();
        })();
        b && (a = "PASS");
    }
})();
console.log(a);
