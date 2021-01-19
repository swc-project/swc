var a = "PASS";
(function () {
    (function (b) {
        (function (b) {
            a && (a.null = "FAIL");
        })();
    })();
})();
console.log(a);
