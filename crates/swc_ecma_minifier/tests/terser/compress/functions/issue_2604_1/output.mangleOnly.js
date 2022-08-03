var t = "FAIL";
(function() {
    try {
        throw 1;
    } catch (c) {
        (function t(c) {
            c && c();
        })();
        c && (t = "PASS");
    }
})();
console.log(t);
