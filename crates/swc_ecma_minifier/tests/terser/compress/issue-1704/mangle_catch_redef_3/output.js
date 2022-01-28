var o = "PASS";
try {
    throw 0;
} catch (a) {
    (function () {
        function b() {
            a = "FAIL";
        }
        b(), b();
    })();
}
console.log(o);
