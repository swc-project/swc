var o = "PASS";
try {
    throw 0;
} catch (o) {
    (function () {
        function c() {
            o = "FAIL";
        }
        c(), c();
    })();
}
console.log(o);
