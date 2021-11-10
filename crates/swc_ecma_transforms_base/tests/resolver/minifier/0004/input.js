var o = "PASS";
try {
    throw 0;
} catch (o) {
    (function () {
        function a() {
            o = "FAIL";
        }
        a(), a();
    })();
}
console.log(o);
