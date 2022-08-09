var o = "PASS";
try {
    throw 0;
} catch (t) {
    (function() {
        function c() {
            t = "FAIL";
        }
        c(), c();
    })();
}
console.log(o);
