var o = "FAIL";
(function() {
    try {
        throw 1;
    } catch (o) {
        (function o(o) {
            o && o();
        })();
        o && (o = "PASS");
    }
})();
console.log(o);
