var o = "FAIL";
(function() {
    try {
        throw 1;
    } catch (c) {
        (function o(_o) {
            _o && _o();
        })();
        c && (o = "PASS");
    }
})();
console.log(o);
