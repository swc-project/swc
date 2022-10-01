var o = "FAIL";
(function() {
    try {
        throw 1;
    } catch (c) {
        (function o(o) {
            o && o();
        })();
        c && (o = "PASS");
    }
})();
console.log(o);
