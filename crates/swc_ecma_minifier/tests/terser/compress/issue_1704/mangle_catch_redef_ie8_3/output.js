var o = "PASS";
try {
    throw 0;
} catch (o) {
    (function() {
        function t() {
            o = "FAIL";
        }
        t(), t();
    })();
}
console.log(o);
