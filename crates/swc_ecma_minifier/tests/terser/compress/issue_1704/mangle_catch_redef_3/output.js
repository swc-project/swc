var o = "PASS";
try {
    throw 0;
} catch (c) {
    (function() {
        function n() {
            c = "FAIL";
        }
        n(), n();
    })();
}
console.log(o);
