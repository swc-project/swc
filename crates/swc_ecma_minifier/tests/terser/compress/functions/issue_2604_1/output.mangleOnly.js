var o = "FAIL";
(function () {
    try {
        throw 1;
    } catch (c) {
        (function o(c) {
            c && c();
        })();
        c && (o = "PASS");
    }
})();
console.log(o);
