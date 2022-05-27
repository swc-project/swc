var a = "PASS";
try {
    throw 0;
} catch (b) {
    (function() {
        function a() {
            b = "FAIL";
        }
        a(), a();
    })();
}
console.log(a);
