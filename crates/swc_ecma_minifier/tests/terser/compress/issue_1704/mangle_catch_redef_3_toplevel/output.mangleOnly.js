var t = "PASS";
try {
    throw 0;
} catch (c) {
    (function() {
        function t() {
            c = "FAIL";
        }
        t(), t();
    })();
}
console.log(t);
